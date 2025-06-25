from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario

class UsuarioAdmin(BaseUserAdmin):
    model = Usuario
    ordering = ['email']
    list_display = ['email', 'nombre_completo', 'rol', 'is_staff']
    search_fields = ['email', 'nombre_completo']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Información Personal', {'fields': ('nombre_completo', 'rol')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre_completo', 'rol', 'password1', 'password2', 'is_staff', 'is_superuser')}
        ),
    )

admin.site.register(Usuario, UsuarioAdmin)
