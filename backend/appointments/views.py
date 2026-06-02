from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum, F, DecimalField
from django.db.models.functions import Coalesce
from .models import RendezVous
from .serializers import RendezVousSerializer
from clients.models import Client


class RendezVousViewSet(viewsets.ModelViewSet):
    serializer_class = RendezVousSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date_heure', 'statut']

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            qs = RendezVous.objects.filter(owner=user).select_related('client', 'service')
        else:
            qs = RendezVous.objects.filter(
                client__user=user
            ).select_related('client', 'service')

        statut = self.request.query_params.get('statut')
        if statut:
            qs = qs.filter(statut=statut)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date_heure__date=date)
        return qs

    def perform_create(self, serializer):
        user = self.request.user

        if user.is_staff:
            serializer.save(owner=user)
            return

        service = serializer.validated_data.get('service')
        admin_owner = service.owner

        client_fiche, created = Client.objects.get_or_create(
            user=user,
            owner=admin_owner,
            defaults={
                'nom': user.last_name or user.username,
                'prenom': user.first_name or '',
                'email': user.email or '',
                'telephone': '',
            }
        )

        serializer.save(owner=admin_owner, client=client_fiche)

    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Rendez-vous du jour (heure locale Africa/Douala)"""
        aujourd_hui = timezone.localtime(timezone.now()).date()
        qs = self.get_queryset().filter(date_heure__date=aujourd_hui)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques générales + montant total généré (admin)"""
        qs = self.get_queryset()
        aujourd_hui = timezone.localtime(timezone.now()).date()

        montant_rdv = qs.filter(
            statut__in=['confirme', 'termine']
        ).aggregate(
            total=Coalesce(Sum('prix_applique'), 0, output_field=DecimalField())
        )['total']

        montant_commandes = 0
        if request.user.is_staff:
            from orders.models import LigneCommande
            from products.models import Produit

            produit_ids = list(
                Produit.objects.filter(owner=request.user).values_list('id', flat=True)
            )
            lignes = LigneCommande.objects.filter(
                produit_id__in=produit_ids
            ).exclude(
                commande__statut='annulee'
            ).annotate(
                ligne_total=F('prix_unitaire') * F('quantite')
            )
            montant_commandes = lignes.aggregate(
                total=Coalesce(Sum('ligne_total'), 0, output_field=DecimalField())
            )['total']

        montant_total = montant_rdv + montant_commandes

        return Response({
            'total': qs.count(),
            'aujourd_hui': qs.filter(date_heure__date=aujourd_hui).count(),
            'ce_mois': qs.filter(date_heure__month=aujourd_hui.month, date_heure__year=aujourd_hui.year).count(),
            'termines': qs.filter(statut='termine').count(),
            'annules': qs.filter(statut='annule').count(),
            'montant_rdv': montant_rdv,
            'montant_commandes': montant_commandes,
            'montant_total': montant_total,
        })