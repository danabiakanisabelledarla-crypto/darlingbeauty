from django.db import models
from django.contrib.auth.models import User


class Commande(models.Model):
    STATUT_CHOICES = [
        ('en_attente',    'En attente'),
        ('confirmee',     'Confirmée'),
        ('en_preparation','En préparation'),
        ('expediee',      'Expédiée'),
        ('livree',        'Livrée'),
        ('annulee',       'Annulée'),
    ]

    client         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commandes')
    statut         = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    adresse_livraison = models.TextField(blank=True, default='')
    notes          = models.TextField(blank=True, default='')
    total          = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    date_creation  = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_creation']

    def __str__(self):
        return f"Commande #{self.id} — {self.client.username}"


class LigneCommande(models.Model):
    commande     = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='lignes')
    produit_id   = models.IntegerField()
    produit_nom  = models.CharField(max_length=255, blank=True, default='')
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    quantite     = models.PositiveIntegerField(default=1)

    @property
    def sous_total(self):
        return self.prix_unitaire * self.quantite

    def __str__(self):
        return f"{self.produit_nom} × {self.quantite}"
