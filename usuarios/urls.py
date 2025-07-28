from django.urls import path
from .views import (
    api_registrar_usuario,
    dashboard_data,
    logout_view,
    forbidden_view,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('registro/', api_registrar_usuario, name='api_registro_usuario'),
    path('dashboard/', dashboard_data, name='dashboard_data'),
    path('logout/', logout_view, name='logout'),
    path('forbidden/', forbidden_view, name='forbidden'),

    # Rutas para JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
