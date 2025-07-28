from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .decorators import role_required
from django.views.generic import CreateView, DetailView, UpdateView, DeleteView, ListView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Instrumento, ArchivoCertificado
from .forms import InstrumentoForm
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from django.contrib.auth import authenticate
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@login_required
@role_required(['ADMIN', 'JEFE'])
def vista_dashboard(request):
    return render(request, 'gestion_instrumentos/dashboard.html')

@ensure_csrf_cookie
def init_csrf(request):
    return JsonResponse({"ok": "CSRF cookie sent"})

class InstrumentoCreateView(LoginRequiredMixin, CreateView):
    model = Instrumento
    form_class = InstrumentoForm
    template_name = 'gestion_instrumentos/registrar_instrumento.html'
    success_url = reverse_lazy('listar_instrumentos')

    def form_valid(self, form):
        response = super().form_valid(form)
        for f in self.request.FILES.getlist('archivo'):
            ArchivoCertificado.objects.create(
                instrumento=self.object,
                archivo=f
            )
        return response

class InstrumentoListView(LoginRequiredMixin, ListView):
    model = Instrumento
    template_name = 'gestion_instrumentos/listar_instrumentos.html'
    context_object_name = 'instrumentos'
    paginate_by = 10

class InstrumentoDetailView(LoginRequiredMixin, DetailView):
    model = Instrumento
    template_name = 'gestion_instrumentos/detalle_instrumento.html'
    context_object_name = 'instrumento'

class InstrumentoUpdateView(LoginRequiredMixin, UpdateView):
    model = Instrumento
    form_class = InstrumentoForm
    template_name = 'gestion_instrumentos/editar_instrumento.html'
    success_url = reverse_lazy('listar_instrumentos')

class InstrumentoDeleteView(LoginRequiredMixin, DeleteView):
    model = Instrumento
    template_name = 'gestion_instrumentos/eliminar_instrumento.html'
    success_url = reverse_lazy('listar_instrumentos')

def api_instrumentos(request):
    if request.method == "GET":
        instrumentos = Instrumento.objects.all().values(
            "id",
            "codigo_unico",
            "nombre_tecnico",
            "marca_modelo",
            "numero_serie",
            "fecha_adquisicion",
            # podés incluir más campos si querés
        )
        return JsonResponse(list(instrumentos), safe=False)