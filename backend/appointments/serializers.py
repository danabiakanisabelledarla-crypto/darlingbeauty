from rest_framework import serializers
from django.utils import timezone
from .models import RendezVous


class RendezVousSerializer(serializers.ModelSerializer):
    client_nom = serializers.SerializerMethodField()
    service_nom = serializers.SerializerMethodField()
    service_duree = serializers.SerializerMethodField()

    class Meta:
        model = RendezVous
        fields = '__all__'
        read_only_fields = ('owner', 'date_creation', 'date_modification')

    def get_client_nom(self, obj):
        return str(obj.client) if obj.client else None

    def get_service_nom(self, obj):
        return obj.service.nom if obj.service else None

    def get_service_duree(self, obj):
        return obj.service.duree_minutes if obj.service else None

    def validate_date_heure(self, value):
        if value < timezone.now():
            # Permettre la création de RDV passés (pour historique) mais avertir
            pass
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        if request:
            # Vérifier que le client appartient à cet utilisateur
            client = attrs.get('client')
            if client and client.owner != request.user:
                raise serializers.ValidationError({"client": "Ce client ne vous appartient pas."})
            # Vérifier que le service appartient à cet utilisateur
            service = attrs.get('service')
            if service and service.owner != request.user:
                raise serializers.ValidationError({"service": "Ce service ne vous appartient pas."})

            # Vérifier les conflits de plages horaires
            date_heure = attrs.get('date_heure')
            if date_heure and service:
                from datetime import timedelta
                fin_nouveau = date_heure + timedelta(minutes=service.duree_minutes)
                qs = RendezVous.objects.filter(
                    owner=request.user,
                    statut__in=['planifie', 'confirme', 'en_cours'],
                )
                if self.instance:
                    qs = qs.exclude(pk=self.instance.pk)
                for rdv in qs:
                    fin_existant = rdv.date_heure + timedelta(minutes=rdv.service.duree_minutes)
                    if date_heure < fin_existant and fin_nouveau > rdv.date_heure:
                        raise serializers.ValidationError(
                            f"Conflit de plage horaire avec le rendez-vous de {rdv.client} ({rdv.service}) "
                            f"prévu à {rdv.date_heure.strftime('%H:%M')}."
                        )
        return attrs
