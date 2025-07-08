from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Instrumento, ArchivoCertificado
from .serializers import InstrumentoSerializer

class InstrumentoViewSet(viewsets.ModelViewSet):
    queryset = Instrumento.objects.all().order_by('-id')
    serializer_class = InstrumentoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        instrumento = serializer.save()
        for file in self.request.FILES.getlist('archivo'):
            ArchivoCertificado.objects.create(instrumento=instrumento, archivo=file)
