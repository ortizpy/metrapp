from rest_framework import serializers
from .models import Instrumento, ArchivoCertificado

class ArchivoCertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoCertificado
        fields = ['archivo', 'descripcion']

class InstrumentoSerializer(serializers.ModelSerializer):
    archivos_certificados = ArchivoCertificadoSerializer(many=True, read_only=True)

    class Meta:
        model = Instrumento
        fields = '__all__'
