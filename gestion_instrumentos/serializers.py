from rest_framework import serializers
from .models import Instrumento, ArchivoCertificado
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if user is None or not user.is_active:
            raise serializers.ValidationError("No active account found with the given credentials")

        data = super().validate(attrs)
        return data

class ArchivoCertificadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivoCertificado
        fields = ['archivo', 'descripcion']

class InstrumentoSerializer(serializers.ModelSerializer):
    archivos_certificados = ArchivoCertificadoSerializer(many=True, read_only=True)

    class Meta:
        model = Instrumento
        fields = '__all__'
