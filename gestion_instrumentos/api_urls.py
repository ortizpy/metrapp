from rest_framework.routers import DefaultRouter
from .api_views import InstrumentoViewSet

router = DefaultRouter()
router.register(r'instrumentos', InstrumentoViewSet, basename='instrumento')

urlpatterns = router.urls
