from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Produit
from .serializers import ProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    serializer_class = ProduitSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'marque', 'description']
    ordering_fields = ['nom', 'prix_vente', 'stock']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            # L'admin voit ses propres produits
            return Produit.objects.filter(owner=user)
        else:
            # Le client voit les produits actifs de tous les admins
            return Produit.objects.filter(owner__is_staff=True, actif=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        # Seul l'admin peut créer/modifier/supprimer
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def stock_bas(self, request):
        qs = self.get_queryset().filter(stock__lte=F('stock_minimum'))
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)