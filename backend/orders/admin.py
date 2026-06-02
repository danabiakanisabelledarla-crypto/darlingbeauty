from django.contrib import admin
from .models import Commande, LigneCommande


class LigneCommandeInline(admin.TabularInline):
    model = LigneCommande
    extra = 0
    readonly_fields = ['produit_nom', 'prix_unitaire', 'sous_total']


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'statut', 'total', 'date_creation']
    list_filter = ['statut']
    inlines = [LigneCommandeInline]
