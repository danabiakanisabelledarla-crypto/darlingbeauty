from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Commande
from .serializers import CommandeSerializer
from products.models import Produit


class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # L'admin voit les commandes contenant au moins un de ses produits
            produit_ids = Produit.objects.filter(owner=user).values_list('id', flat=True)
            return Commande.objects.filter(
                lignes__produit_id__in=produit_ids
            ).distinct()
        return Commande.objects.filter(client=user)

    @action(detail=False, methods=['get'], url_path='mes_commandes')
    def mes_commandes(self, request):
        qs = Commande.objects.filter(client=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)