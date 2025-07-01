from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UsuarioRegistroSerializer

@api_view(['POST'])
def api_registrar_usuario(request):
    serializer = UsuarioRegistroSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()

        # Asignar grupo automáticamente
        from django.contrib.auth.models import Group
        grupo = Group.objects.get(name=usuario.rol.upper())
        usuario.groups.add(grupo)

        return Response({"mensaje": "Usuario registrado correctamente."}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
