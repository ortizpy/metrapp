# metrapp_backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from usuarios.forms import EmailAuthenticationForm
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from gestion_instrumentos.views import init_csrf
from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenObtainPairView

schema_view = get_schema_view(
    openapi.Info(
        title="MetrApp API",
        default_version='v1',
        description="Documentación de la API de gestión de instrumentos",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/init-csrf/", init_csrf, name="init-csrf"),
    path('', include('gestion_instrumentos.urls')),
    path('usuarios/', include('usuarios.urls')),
    path('api/', include('gestion_instrumentos.api_urls')),
    path('accounts/login/', auth_views.LoginView.as_view(authentication_form=EmailAuthenticationForm, template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
]
