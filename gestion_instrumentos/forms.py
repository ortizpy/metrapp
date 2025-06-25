from django import forms
from django.core.exceptions import ValidationError
from datetime import date
from .models import Instrumento, FUENTES_FINANCIACION, GARANTIA_CHOICES

class InstrumentoForm(forms.ModelForm):
    garantia_vigente = forms.ChoiceField(
        choices=GARANTIA_CHOICES,
        widget=forms.RadioSelect(),
        label="Garantía vigente"
    )
    class Meta:
        model = Instrumento
        fields = '__all__'
        labels = {
            'llamado_contrato': 'N° ID de Llamado/Contrato',
        }
        widgets = {
            # Sección 1: Identificación General del Equipo
            'codigo_unico': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: EQ-MAS-001'}),
            'nombre_tecnico': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: Comparador de masas'}),
            'marca_modelo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: Mettler Toledo XP56'}),
            'numero_serie': forms.TextInput(attrs={'class': 'form-control'}),
            'clasificacion_metrologica': forms.Select(attrs={'class': 'form-select'}),
            'laboratorio_responsable': forms.Select(attrs={'class': 'form-select'}),
            'peso_neto': forms.NumberInput(attrs={'class': 'form-control', 'step': 'any', 'placeholder': 'kg'}),
            'peso_bruto': forms.NumberInput(attrs={'class': 'form-control', 'step': 'any', 'placeholder': 'kg'}),
            'dimensiones': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Largo x Ancho x Alto (m x m x m)'}),

            # Sección 2: Datos de Adquisición y Patrimonio
            'fecha_adquisicion': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'costo_adquisicion': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'En guaraníes'}),
            'llamado_contrato': forms.TextInput(attrs={'class': 'form-control'}),
            'proveedor': forms.TextInput(attrs={'class': 'form-control'}),

            'fuente_financiacion': forms.Select(attrs={'class': 'form-select', 'id': 'id_fuente_financiacion'}),
            'fuente_otro': forms.TextInput(attrs={'class': 'form-control d-none', 'id': 'id_fuente_otro'}),

            'fecha_vencimiento_garantia': forms.DateInput(attrs={'type': 'date', 'class': 'form-control', 'id': 'id_fecha_vencimiento_garantia'}),

        }

    def clean_fecha_adquisicion(self):
        fecha = self.cleaned_data.get('fecha_adquisicion')
        if fecha and fecha > date.today():
            raise ValidationError("La fecha de adquisición no puede ser futura.")
        return fecha

    def clean_numero_serie(self):
        numero = self.cleaned_data.get('numero_serie')
        if numero and len(numero) < 4:
            raise ValidationError("El número de serie debe tener al menos 4 caracteres.")
        return numero

    def clean_peso_neto(self):
        peso = self.cleaned_data.get('peso_neto')
        if peso is not None and peso < 0:
            raise ValidationError("El peso neto no puede ser negativo.")
        return peso

    def clean_peso_bruto(self):
        peso = self.cleaned_data.get('peso_bruto')
        if peso is not None and peso < 0:
            raise ValidationError("El peso bruto no puede ser negativo.")
        return peso

    def clean_dimensiones(self):
        dimensiones = self.cleaned_data.get('dimensiones')
        if dimensiones:
            import re
            patron = r'^\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*x\s*\d+(\.\d+)?\s*$'
            if not re.match(patron, dimensiones):
                raise ValidationError("El formato debe ser: Largo x Ancho x Alto (ejemplo: 1.00 x 2.00 x 3.00)")
        return dimensiones

    def clean_fecha_vencimiento_garantia(self):
        vigente = self.cleaned_data.get('garantia_vigente')
        fecha = self.cleaned_data.get('fecha_vencimiento_garantia')

        if vigente == 'SI' and not fecha:
            raise ValidationError("Debe ingresar la fecha de vencimiento de la garantía si ha seleccionado 'Sí'.")
        return fecha



'''
from django.db import models

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

    CLASIFICACION_CHOICES = [
        ('PN', 'Patrón Nacional'),
        ('PR', 'Patrón de Referencia'),
        ('PT', 'Patrón de Trabajo'),
        ('EA', 'Equipo Auxiliar'),
    ]
    clasificacion_metrologica = models.CharField(max_length=2, choices=CLASIFICACION_CHOICES)

    LABORATORIO_CHOICES = [
        ('LPR', 'LPR'), ('LFU', 'LFU'), ('LLO', 'LLO'), ('LMA', 'LMA'),
        ('LCB', 'LCB'), ('LVD', 'LVD'), ('LTE', 'LTE'), ('LEL', 'LEL'),
        ('LTF', 'LTF'), ('LMQ', 'LMQ'),
    ]
    laboratorio_responsable = models.CharField(max_length=4, choices=LABORATORIO_CHOICES)

    peso_neto = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    peso_bruto = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    dimensiones = models.CharField(max_length=50, help_text="Formato: Largo x Ancho x Alto", blank=True)

    fecha_adquisicion = models.DateField()

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

'''