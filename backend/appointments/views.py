from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RendezVous
from .serializers import RendezVousSerializer


class RendezVousViewSet(viewsets.ModelViewSet):
    serializer_class = RendezVousSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['date_heure', 'statut']

    def get_queryset(self):
        qs = RendezVous.objects.filter(owner=self.request.user).select_related('client', 'service')
        # Filtres optionnels
        statut = self.request.query_params.get('statut')
        if statut:
            qs = qs.filter(statut=statut)
        date = self.request.query_params.get('date')
        if date:
            qs = qs.filter(date_heure__date=date)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def aujourd_hui(self, request):
        """Rendez-vous du jour"""
        aujourd_hui = timezone.now().date()
        qs = self.get_queryset().filter(date_heure__date=aujourd_hui)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques générales"""
        qs = self.get_queryset()
        aujourd_hui = timezone.now().date()
        return Response({
            'total': qs.count(),
            'aujourd_hui': qs.filter(date_heure__date=aujourd_hui).count(),
            'ce_mois': qs.filter(date_heure__month=aujourd_hui.month, date_heure__year=aujourd_hui.year).count(),
            'termines': qs.filter(statut='termine').count(),
            'annules': qs.filter(statut='annule').count(),
        })
