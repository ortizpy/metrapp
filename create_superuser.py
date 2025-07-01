import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'metrapp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin1234'
    )
    print("✅ Superusuario creado.")
else:
    print("ℹ️ El superusuario ya existe.")
