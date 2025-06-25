from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .decorators import role_required
from django.views.generic import CreateView, DetailView, UpdateView, DeleteView, ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Instrumento
from .forms import InstrumentoForm

@login_required
@role_required(['ADMIN', 'JEFE'])
def vista_dashboard(request):
    return render(request, 'gestion_instrumentos/dashboard.html')

class InstrumentoCreateView(LoginRequiredMixin, CreateView):
    model = Instrumento
    form_class = InstrumentoForm
    template_name = 'gestion_instrumentos/registrar_instrumento.html'
    success_url = reverse_lazy('dashboard')

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
