from django.contrib import admin
from .models import Produit


@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('nom', 'marque', 'prix_vente', 'stock', 'stock_minimum', 'stock_bas', 'actif')
    list_filter = ('actif', 'marque')
    search_fields = ('nom', 'marque', 'description')
    ordering = ('nom',)
    list_per_page = 25
    readonly_fields = ('date_creation', 'stock_bas', 'marge')

    fieldsets = (
        ('Informations produit', {
            'fields': ('nom', 'marque', 'description', 'actif')
        }),
        ('Prix', {
            'fields': ('prix_achat', 'prix_vente', 'marge')
        }),
        ('Stock', {
            'fields': ('stock', 'stock_minimum', 'stock_bas')
        }),
        ('Métadonnées', {
            'fields': ('owner', 'date_creation'),
            'classes': ('collapse',)
        }),
    )
