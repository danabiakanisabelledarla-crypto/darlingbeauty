from rest_framework import viewsets, filters, permissions
from .models import Service, Categorie
from .serializers import ServiceSerializer, CategorieSerializer


class CategorieViewSet(viewsets.ModelViewSet):
    serializer_class = CategorieSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Categorie.objects.filter(owner=user)
        return Categorie.objects.filter(owner__is_staff=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'prix', 'duree_minutes']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Service.objects.filter(owner=user)
        # Le client voit tous les services actifs des admins
        return Service.objects.filter(owner__is_staff=True, actif=True)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]