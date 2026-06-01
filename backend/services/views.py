from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Service, Categorie
from .serializers import ServiceSerializer, CategorieSerializer


class CategorieViewSet(viewsets.ModelViewSet):
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Categorie.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'prix', 'duree_minutes']

    def get_queryset(self):
        return Service.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
