from django.contrib import admin
from .models import RendezVous


@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ('client', 'service', 'date_heure', 'statut', 'prix_applique', 'date_creation')
    list_filter = ('statut', 'date_heure')
    search_fields = ('client__nom', 'client__prenom', 'service__nom')
    ordering = ('-date_heure',)
    list_per_page = 25
    date_hierarchy = 'date_heure'
    readonly_fields = ('date_creation', 'date_modification')

    fieldsets = (
        ('Rendez-vous', {
            'fields': ('client', 'service', 'date_heure', 'statut')
        }),
        ('Facturation', {
            'fields': ('prix_applique',)
        }),
        ('Notes & Métadonnées', {
            'fields': ('notes', 'owner', 'date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
