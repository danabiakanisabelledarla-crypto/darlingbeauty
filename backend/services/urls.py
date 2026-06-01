from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, CategorieViewSet

router = DefaultRouter()
router.register(r'categories', CategorieViewSet, basename='categorie')
router.register(r'', ServiceViewSet, basename='service')

urlpatterns = [
    path('', include(router.urls)),
]
