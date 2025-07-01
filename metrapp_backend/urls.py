# metrapp_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from usuarios.forms import EmailAuthenticationForm

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('gestion_instrumentos.urls')),
    path('usuarios/', include('usuarios.urls')),  # ← AGREGAR ESTO
    path('accounts/login/', auth_views.LoginView.as_view(
        authentication_form=EmailAuthenticationForm,
        template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
]
