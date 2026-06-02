from rest_framework import serializers
from django.utils import timezone
from .models import RendezVous
from clients.models import Client
from services.models import Service


class RendezVousSerializer(serializers.ModelSerializer):
    client_nom    = serializers.SerializerMethodField()
    service_nom   = serializers.SerializerMethodField()
    service_duree = serializers.SerializerMethodField()

    class Meta:
        model  = RendezVous
        fields = '__all__'
        read_only_fields = ('owner', 'date_creation', 'date_modification')
        extra_kwargs = {
            'client': {'required': False},
        }

    def get_client_nom(self, obj):
        return str(obj.client) if obj.client else None

    def get_service_nom(self, obj):
        return obj.service.nom if obj.service else None

    def get_service_duree(self, obj):
        return obj.service.duree_minutes if obj.service else None

    def validate(self, attrs):
        request = self.context.get('request')
        if not request:
            return attrs

        user = request.user

        # ── Validation du client ──────────────────────────────────────
        client = attrs.get('client')
        if client:
            if user.is_staff and client.owner != user:
                raise serializers.ValidationError(
                    {"client": "Ce client ne vous appartient pas."}
                )

        # ── Validation du service ─────────────────────────────────────
        service = attrs.get('service')
        if service:
            if user.is_staff:
                if service.owner != user:
                    raise serializers.ValidationError(
                        {"service": "Ce service ne vous appartient pas."}
                    )
            else:
                if not service.owner.is_staff:
                    raise serializers.ValidationError(
                        {"service": "Service invalide."}
                    )

        # ── Détection des conflits horaires (côté admin seulement) ───
        if user.is_staff and service and attrs.get('date_heure'):
            from datetime import timedelta
            date_heure  = attrs['date_heure']
            fin_nouveau = date_heure + timedelta(minutes=service.duree_minutes)
            qs = RendezVous.objects.filter(
                owner=user,
                statut__in=['planifie', 'confirme', 'en_cours'],
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            for rdv in qs:
                fin_existant = rdv.date_heure + timedelta(minutes=rdv.service.duree_minutes)
                if date_heure < fin_existant and fin_nouveau > rdv.date_heure:
                    raise serializers.ValidationError(
                        f"Conflit de plage horaire avec le rendez-vous de {rdv.client} "
                        f"({rdv.service}) prévu à {rdv.date_heure.strftime('%H:%M')}."
                    )

        return attrs