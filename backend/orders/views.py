from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Commande
from .serializers import CommandeSerializer


class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Commande.objects.all()
        return Commande.objects.filter(client=user)

    @action(detail=False, methods=['get'], url_path='mes_commandes')
    def mes_commandes(self, request):
        qs = Commande.objects.filter(client=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
