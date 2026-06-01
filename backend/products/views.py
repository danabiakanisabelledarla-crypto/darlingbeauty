from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Produit
from .serializers import ProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    serializer_class = ProduitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'marque', 'description']
    ordering_fields = ['nom', 'prix_vente', 'stock']

    def get_queryset(self):
        return Produit.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def stock_bas(self, request):
        """Produits dont le stock est en dessous du seuil minimum"""
        qs = self.get_queryset().filter(stock__lte=F('stock_minimum'))
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
