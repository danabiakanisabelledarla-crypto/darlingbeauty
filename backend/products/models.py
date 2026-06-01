from django.db import models
from django.contrib.auth.models import User


class Produit(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='produits')
    nom = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    marque = models.CharField(max_length=100, blank=True, null=True)
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    stock_minimum = models.PositiveIntegerField(default=5, help_text="Seuil d'alerte stock bas")
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nom']
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'

    def __str__(self):
        return f"{self.nom} ({self.stock} en stock)"

    @property
    def stock_bas(self):
        return self.stock <= self.stock_minimum

    @property
    def marge(self):
        return self.prix_vente - self.prix_achat
