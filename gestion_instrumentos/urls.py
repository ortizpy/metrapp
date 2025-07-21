# gestion_instrumentos/urls.py

from django.urls import path
from .  import views
from .views import (
    vista_dashboard,
    InstrumentoCreateView,
    InstrumentoListView,
    InstrumentoDetailView,
    InstrumentoUpdateView,
    InstrumentoDeleteView,
)

urlpatterns = [
    path('', vista_dashboard, name='home'),
    path('dashboard/', vista_dashboard, name='dashboard'),
    path('instrumentos/nuevo/', InstrumentoCreateView.as_view(), name='crear_instrumento'),
    path('instrumentos/', InstrumentoListView.as_view(), name='listar_instrumentos'),
    path('instrumentos/<int:pk>/', InstrumentoDetailView.as_view(), name='detalle_instrumento'),
    path('instrumentos/<int:pk>/editar/', InstrumentoUpdateView.as_view(), name='editar_instrumento'),
    path('instrumentos/<int:pk>/eliminar/', InstrumentoDeleteView.as_view(), name='eliminar_instrumento'),
    # path("api/instrumentos/", views.api_instrumentos, name="api_instrumentos"),
]
