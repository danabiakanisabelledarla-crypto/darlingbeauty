from rest_framework import serializers
from .models import Commande, LigneCommande
from products.models import Produit


class LigneCommandeSerializer(serializers.ModelSerializer):
    sous_total = serializers.ReadOnlyField()

    class Meta:
        model = LigneCommande
        fields = ['produit_id', 'produit_nom', 'prix_unitaire', 'quantite', 'sous_total']
        read_only_fields = ['produit_nom', 'prix_unitaire', 'sous_total']


class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True)
    client_username = serializers.CharField(source='client.username', read_only=True)

    class Meta:
        model = Commande
        fields = ['id', 'client_username', 'statut', 'lignes', 'total',
                  'adresse_livraison', 'notes', 'date_creation', 'date_modification']
        read_only_fields = ['id', 'client_username', 'total', 'date_creation', 'date_modification']

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        commande = Commande.objects.create(
            client=self.context['request'].user,
            **validated_data
        )
        total = 0
        for ligne_data in lignes_data:
            produit_id = ligne_data['produit_id']
            quantite = ligne_data['quantite']
            try:
                produit = Produit.objects.get(id=produit_id)
                ligne = LigneCommande.objects.create(
                    commande=commande,
                    produit_id=produit_id,
                    produit_nom=produit.nom,
                    prix_unitaire=produit.prix_vente,
                    quantite=quantite
                )
                total += ligne.sous_total
                # Décrémenter le stock
                produit.stock = max(0, produit.stock - quantite)
                produit.save()
            except Produit.DoesNotExist:
                pass
        commande.total = total
        commande.save()
        return commande
