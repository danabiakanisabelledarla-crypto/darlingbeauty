from django.contrib import admin
from .models import Service, Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('nom', 'couleur', 'owner')
    search_fields = ('nom',)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'categorie', 'duree_minutes', 'prix', 'actif', 'date_creation')
    list_filter = ('actif', 'categorie')
    search_fields = ('nom', 'description')
    ordering = ('nom',)
    list_per_page = 25
    readonly_fields = ('date_creation',)
