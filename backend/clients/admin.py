from django.contrib import admin
from .models import Client


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('nom_complet', 'telephone', 'email', 'genre', 'actif', 'date_creation')
    list_filter = ('genre', 'actif', 'date_creation')
    search_fields = ('nom', 'prenom', 'email', 'telephone')
    ordering = ('nom', 'prenom')
    list_per_page = 25
    date_hierarchy = 'date_creation'
    readonly_fields = ('date_creation',)

    fieldsets = (
        ('Informations personnelles', {
            'fields': ('prenom', 'nom', 'genre', 'date_naissance')
        }),
        ('Contact', {
            'fields': ('telephone', 'email', 'adresse')
        }),
        ('Autres informations', {
            'fields': ('notes', 'actif', 'owner', 'date_creation')
        }),
    )
