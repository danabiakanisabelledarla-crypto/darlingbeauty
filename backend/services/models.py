from django.db import models
from django.contrib.auth.models import User


class Categorie(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories')
    nom = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    couleur = models.CharField(max_length=7, default='#E91E8C', help_text="Couleur HEX ex: #E91E8C")

    class Meta:
        ordering = ['nom']
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'

    def __str__(self):
        return self.nom


class Service(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, blank=True, related_name='services')
    nom = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    duree_minutes = models.PositiveIntegerField(help_text="Durée en minutes")
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    actif = models.BooleanField(default=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nom']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'

    def __str__(self):
        return f"{self.nom} ({self.duree_minutes} min — {self.prix} FCFA)"
