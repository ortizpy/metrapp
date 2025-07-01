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
    costo_adquisicion = models.DecimalField(max_digits=15, decimal_places=0, null=True, blank=True)
    llamado_contrato = models.CharField(max_length=255, null=True, blank=True)
    proveedor = models.CharField(max_length=255, null=True, blank=True)

    fuente_financiacion = models.CharField(max_length=20, choices=FUENTES_FINANCIACION, null=True, blank=True)
    fuente_otro = models.CharField(max_length=255, null=True, blank=True)
    '''garantia_vigente = models.BooleanField(default=False)'''

    garantia_vigente = models.CharField(
        max_length=2,
        choices=GARANTIA_CHOICES,
        default='NO'
    )

    fecha_vencimiento_garantia = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_tecnico} ({self.codigo_unico})"

    # Sección 3: Calibración y Trazabilidad (Inicial)
    fecha_calibracion_inicial = models.DateField(null=True, blank=True)
    ultima_fecha_calibracion = models.DateField(null=True, blank=True)
    calibrado_por = models.CharField(max_length=255, null=True, blank=True)
    numero_certificado_calibracion = models.CharField(max_length=255, null=True, blank=True)
    patron_asociado = models.CharField(max_length=255, null=True, blank=True)
    intervalo_calibracion = models.PositiveIntegerField(null=True, blank=True)

    # Sección 4: Verificación y Criterios de Aceptación
    intervalo_verificacion = models.PositiveIntegerField(null=True, blank=True, help_text="Frecuencia en meses")
    parametro_verificado = models.CharField(max_length=255, null=True, blank=True)
    tolerancia_permitida = models.CharField(max_length=255, null=True, blank=True)
    criterio_aceptacion = models.CharField(max_length=500, null=True, blank=True)
    observaciones_verificacion = models.TextField(null=True, blank=True)


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

    
class ArchivoCertificado(models.Model):
    instrumento = models.ForeignKey(Instrumento, on_delete=models.CASCADE, related_name='archivos_certificados')
    archivo = models.FileField(upload_to='certificados/')
    descripcion = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Certificado - {self.instrumento.codigo_unico}"
