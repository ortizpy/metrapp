import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'metrapp_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

admin_email = "admin@example.com"

if not User.objects.filter(email=admin_email).exists():
    User.objects.create_superuser(
        email=admin_email,
        nombre="Administrador",  # ← campo correcto del modelo
        rol="ADMIN",
        password="admin1234"
    )
    print("✅ Superusuario creado.")
else:
    print("ℹ️ El superusuario ya existe.")
