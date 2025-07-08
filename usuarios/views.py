from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
import json
from django.contrib.auth.decorators import login_required
from gestion_instrumentos.models import Instrumento, CertificadoCalibracion

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UsuarioRegistroSerializer

@csrf_exempt
@require_POST
def login_api(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    user = authenticate(request, email=email, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login correcto'}, status=200)
    else:
        return JsonResponse({'error': 'Credenciales inválidas'}, status=403)
    
@csrf_exempt
@require_GET
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Sesión cerrada'})

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

@login_required(login_url='/usuarios/forbidden/')
def dashboard_data(request):    
    usuario = request.user
    rol = usuario.rol.upper()

    data = {
        'nombre': usuario.nombre,
        'email': usuario.email,
        'rol': rol,
        'total_instrumentos': Instrumento.objects.count(),
        'total_certificados': CertificadoCalibracion.objects.count(),
        'puede_generar_reportes': rol in ['ADMIN', 'JEFE']
    }

    return JsonResponse(data)

from django.http import JsonResponse

def forbidden_view(request):
    return JsonResponse({'error': 'Autenticación requerida'}, status=403)
