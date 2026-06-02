from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    GENRE_CHOICES = [
        ('F', 'Femme'),
        ('M', 'Homme'),
        ('A', 'Autre'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True,related_name='fiche_client',help_text="Compte utilisateur lié (si le client a un accès)")
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=20)
    genre = models.CharField(max_length=1, choices=GENRE_CHOICES, default='F')
    date_naissance = models.DateField(blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True, help_text="Allergies, préférences, remarques")
    date_creation = models.DateTimeField(auto_now_add=True)
    actif = models.BooleanField(default=True)

    class Meta:
        ordering = ['nom', 'prenom']
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    @property
    def nom_complet(self):
        return f"{self.prenom} {self.nom}"
