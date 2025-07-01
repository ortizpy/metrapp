from django.contrib import admin
from .models import Instrumento, CertificadoCalibracion, HistorialDeriva, ArchivoCertificado

admin.site.register(Instrumento)
admin.site.register(CertificadoCalibracion)
admin.site.register(HistorialDeriva)
admin.site.register(ArchivoCertificado)
