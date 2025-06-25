from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
CLASIFICACION_CHOICES = [
        ('PN', 'Patrón Nacional'),
        ('PR', 'Patrón de Referencia'),
        ('PT', 'Patrón de Trabajo'),
        ('EA', 'Equipo Auxiliar'),
]
FUENTES_FINANCIACION = [
        ('TESORO', 'Tesoro'),
        ('PROYECTO', 'Proyecto Internacional'),
        ('COOPERACION', 'Cooperación'),
        ('OTRO', 'Otro'),
]
LABORATORIO_CHOICES = [
        ('LPR', 'LPR'), ('LFU', 'LFU'), ('LLO', 'LLO'), ('LMA', 'LMA'),
        ('LCB', 'LCB'), ('LVD', 'LVD'), ('LTE', 'LTE'), ('LEL', 'LEL'),
        ('LTF', 'LTF'), ('LMQ', 'LMQ'),
]
GARANTIA_CHOICES = [
    ('SI', 'Sí'),
    ('NO', 'No'),
]


class TipoInstrumento(models.Model):
    nombre_tipo = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return self.nombre_tipo


class Instrumento(models.Model):
    # Sección 1: Identificación General del Equipo
    codigo_unico = models.CharField(max_length=50, unique=True)
    nombre_tecnico = models.CharField(max_length=100)
    marca_modelo = models.CharField(max_length=100)
    numero_serie = models.CharField(max_length=100, unique=True)

    clasificacion_metrologica = models.CharField(max_length=2, choices=CLASIFICACION_CHOICES)

    laboratorio_responsable = models.CharField(max_length=4, choices=LABORATORIO_CHOICES)

    peso_neto = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    peso_bruto = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    dimensiones = models.CharField(max_length=50, help_text="Formato: Largo x Ancho x Alto", blank=True)


    # Sección 2: Datos de Adquisición y Patrimonio
    fecha_adquisicion = models.DateField()
    costo_adquisicion = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    llamado_contrato = models.CharField(max_length=255, null=True, blank=True)
    proveedor = models.CharField(max_length=255, null=True, blank=True)

    fuente_financiacion = models.CharField(max_length=20, choices=FUENTES_FINANCIACION, null=True, blank=True)
    fuente_otro = models.CharField(max_length=255, null=True, blank=True)
    '''garantia_vigente = models.BooleanField(default=False)'''

    garantia_vigente = models.CharField(
        max_length=2,
        choices=GARANTIA_CHOICES,
        null=True,
        blank=True
    )

    fecha_vencimiento_garantia = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_tecnico} ({self.codigo_unico})"




class CertificadoCalibracion(models.Model):
    instrumento = models.ForeignKey(Instrumento, on_delete=models.CASCADE, related_name='certificados')
    fecha_calibracion = models.DateField()
    fecha_proxima_calibracion = models.DateField()
    resultado = models.TextField()
    incertidumbre = models.DecimalField(max_digits=10, decimal_places=5)
    archivo_pdf = models.FileField(upload_to='certificados/')
    tecnico = models.CharField(max_length=100)

    def __str__(self):
        return f"Certificado de {self.instrumento} - {self.fecha_calibracion}"


class HistorialDeriva(models.Model):
    instrumento = models.ForeignKey(Instrumento, on_delete=models.CASCADE)
    fecha = models.DateField()
    valor_deriva = models.DecimalField(max_digits=10, decimal_places=5)
    observaciones = models.TextField(blank=True)

    def __str__(self):
        return f"Deriva de {self.instrumento} - {self.fecha}"


class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El correo electrónico es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    nombre_completo = models.CharField(max_length=255)
    rol = models.CharField(max_length=50, choices=[('ADMIN', 'Admin'), ('JEFE', 'Jefe'), ('TECNICO', 'Técnico')])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre_completo', 'rol']

    def __str__(self):
        return self.email

