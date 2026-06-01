from django.db import models
from django.contrib.auth.models import User
from clients.models import Client
from services.models import Service


class RendezVous(models.Model):
    STATUT_CHOICES = [
        ('planifie', 'Planifié'),
        ('confirme', 'Confirmé'),
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('annule', 'Annulé'),
        ('absent', 'Client absent'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rendez_vous')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='rendez_vous')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='rendez_vous')
    date_heure = models.DateTimeField()
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='planifie')
    notes = models.TextField(blank=True, null=True)
    prix_applique = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                        help_text="Prix réel appliqué (peut différer du prix catalogue)")
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_heure']
        verbose_name = 'Rendez-vous'
        verbose_name_plural = 'Rendez-vous'

    def __str__(self):
        return f"{self.client} — {self.service} — {self.date_heure.strftime('%d/%m/%Y %H:%M')}"

    def save(self, *args, **kwargs):
        # Auto-remplir le prix appliqué avec le prix du service si non défini
        if self.prix_applique is None and self.service_id:
            self.prix_applique = self.service.prix
        super().save(*args, **kwargs)
