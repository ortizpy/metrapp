import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'metrapp_backend.settings')
django.setup()

from usuarios.models import Usuario

admin_email = "admin@example.com"

if not Usuario.objects.filter(email=admin_email).exists():
    Usuario.objects.create_superuser(
        email=admin_email,
        password="admin1234",
        nombre="Administrador",  # ← campo correcto del modelo
        rol="ADMIN"
    )
    print("✅ Superusuario creado.")
else:
    print("ℹ️ El superusuario ya existe.")
