from rest_framework import serializers
from .models import Service, Categorie


class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = '__all__'
        read_only_fields = ('owner',)


class ServiceSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('owner', 'date_creation')

    def get_categorie_nom(self, obj):
        return obj.categorie.nom if obj.categorie else None

    def validate_prix(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix doit être supérieur à 0.")
        return value

    def validate_duree_minutes(self, value):
        if value < 5:
            raise serializers.ValidationError("La durée minimale d'un service est de 5 minutes.")
        if value > 480:
            raise serializers.ValidationError("La durée maximale d'un service est de 480 minutes (8h).")
        return value
