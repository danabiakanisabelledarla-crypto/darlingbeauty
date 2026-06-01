from rest_framework import serializers
from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    nom_complet = serializers.ReadOnlyField()

    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ('owner', 'date_creation')

    def validate_telephone(self, value):
        # Nettoyer le numéro de téléphone
        cleaned = ''.join(filter(str.isdigit, value.replace('+', '')))
        if len(cleaned) < 8:
            raise serializers.ValidationError("Le numéro de téléphone doit contenir au moins 8 chiffres.")
        return value

    def validate_email(self, value):
        if value:
            request = self.context.get('request')
            if request:
                qs = Client.objects.filter(owner=request.user, email=value)
                if self.instance:
                    qs = qs.exclude(pk=self.instance.pk)
                if qs.exists():
                    raise serializers.ValidationError("Un client avec cet email existe déjà.")
        return value
