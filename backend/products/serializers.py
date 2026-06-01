from rest_framework import serializers
from .models import Produit


class ProduitSerializer(serializers.ModelSerializer):
    stock_bas = serializers.ReadOnlyField()
    marge = serializers.ReadOnlyField()

    class Meta:
        model = Produit
        fields = '__all__'
        read_only_fields = ('owner', 'date_creation')

    def validate_prix_vente(self, value):
        if value <= 0:
            raise serializers.ValidationError("Le prix de vente doit être supérieur à 0.")
        return value

    def validate_prix_achat(self, value):
        if value < 0:
            raise serializers.ValidationError("Le prix d'achat ne peut pas être négatif.")
        return value

    def validate(self, attrs):
        prix_achat = attrs.get('prix_achat', getattr(self.instance, 'prix_achat', None))
        prix_vente = attrs.get('prix_vente', getattr(self.instance, 'prix_vente', None))
        if prix_achat and prix_vente and prix_vente < prix_achat:
            raise serializers.ValidationError(
                {"prix_vente": "Le prix de vente ne peut pas être inférieur au prix d'achat."}
            )
        return attrs
