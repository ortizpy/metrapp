from django import forms
from django.core.exceptions import ValidationError
from datetime import date
from .models import Instrumento, FUENTES_FINANCIACION, ArchivoCertificado

class InstrumentoForm(forms.ModelForm):
    GARANTIA_CHOICES = (
        ('SI', 'Sí'),
        ('NO', 'No'),
    )

    garantia_vigente = forms.ChoiceField(
        choices=GARANTIA_CHOICES,
        widget=forms.RadioSelect(),
        label='¿Garantía vigente?',
    )

    class Meta:
        model = Instrumento
        fields = '__all__'
        widgets = {
            # Sección 1
            'codigo_unico': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: EQ-MAS-001'}),
            'nombre_tecnico': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: Comparador de masas'}),
            'marca_modelo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ej.: Mettler Toledo XP56'}),
            'numero_serie': forms.TextInput(attrs={'class': 'form-control'}),
            'clasificacion_metrologica': forms.Select(attrs={'class': 'form-select'}),
            'laboratorio_responsable': forms.Select(attrs={'class': 'form-select'}),
            'peso_neto': forms.NumberInput(attrs={'class': 'form-control', 'step': 'any', 'placeholder': 'kg'}),
            'peso_bruto': forms.NumberInput(attrs={'class': 'form-control', 'step': 'any', 'placeholder': 'kg'}),
            'dimensiones': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Largo x Ancho x Alto (m x m x m)'}),

            # Sección 2
            'fecha_adquisicion': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'costo_adquisicion': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'En guaraníes'}),
            'llamado_contrato': forms.TextInput(attrs={'class': 'form-control'}),
            'proveedor': forms.TextInput(attrs={'class': 'form-control'}),
            'fuente_financiacion': forms.Select(attrs={'class': 'form-select', 'id': 'id_fuente_financiacion'}),
            'fuente_otro': forms.TextInput(attrs={'class': 'form-control', 'id': 'id_fuente_otro'}),
            'fecha_vencimiento_garantia': forms.DateInput(attrs={'type': 'date', 'class': 'form-control', 'id': 'id_fecha_vencimiento_garantia'}),

            # Sección 3
            'fecha_calibracion_inicial': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'ultima_fecha_calibracion': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'calibrado_por': forms.TextInput(attrs={'class': 'form-control'}),
            'numero_certificado_calibracion': forms.TextInput(attrs={'class': 'form-control'}),
            'patron_asociado': forms.TextInput(attrs={'class': 'form-control'}),
            'intervalo_calibracion': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Meses'}),
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
            raise ValidationError("Debe ingresar la fecha de vencimiento de la garantía.")
        return fecha
