from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .models import Usuario

class EmailAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(
        label="Correo electrónico",
        widget=forms.EmailInput(attrs={"autofocus": True})
    )

class RegistroUsuarioForm(UserCreationForm):
    class Meta:
        model = Usuario
        fields = ['email', 'nombre', 'rol', 'password1', 'password2']
        labels = {
            'email': 'Correo electrónico',
            'nombre': 'Nombre completo',
            'rol': 'Rol',
            'password1': 'Contraseña',
            'password2': 'Confirmar contraseña',
        }
