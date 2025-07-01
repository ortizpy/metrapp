from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UsuarioRegistroSerializer

@csrf_exempt
@require_POST
def login_api(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login correcto'}, status=200)
    else:
        return JsonResponse({'error': 'Credenciales inválidas'}, status=403)

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
