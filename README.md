GestiónCal - App de Gestión de Calibraciones
Descripción del Proyecto
GestiónCal es una aplicación web diseñada para la gestión integral del ciclo de vida de patrones e instrumentos de medición en laboratorios de calibración. El objetivo es centralizar la información, automatizar cálculos metrológicos clave, predecir fechas de calibración y generar alertas para mejorar la eficiencia, la calidad y la trazabilidad metrológica del laboratorio.

El proyecto se está desarrollando de manera incremental, comenzando con un módulo piloto enfocado en el laboratorio de calibración de presión.

✨ Características Principales
Gestión de Inventario: Base de datos centralizada de todos los instrumentos y patrones del laboratorio.

Registro de Calibraciones: Carga detallada de certificados de calibración, incluyendo resultados punto por punto, incertidumbres y condiciones ambientales.

Historial Completo: Trazabilidad total del historial de cada instrumento.

Análisis Metrológico:

Cálculo automático de la deriva del instrumento.

Análisis de Error Máximo Permisible (EMP).

Verificación de descenso de clase.

Alertas y Notificaciones: Avisos automáticos para fechas de calibración próximas y equipos en estado crítico.

Gestión de Usuarios: Roles y permisos para Jefes de Laboratorio y Técnicos.

💻 Pila Tecnológica (Tech Stack)
Backend: Python 3.9+ con Django y Django REST Framework.

Frontend: React.

Base de Datos: PostgreSQL.

Comunicación: API REST.

🚀 Estado Actual del Proyecto
El proyecto se encuentra en la Semana 1: Configuración e Inicio. Las tareas actuales se centran en establecer la estructura del proyecto y la base de datos. Para más detalles, consulta el archivo ROADMAP_SEMANA_1.md.

⚙️ Cómo Empezar (Getting Started)
Sigue estos pasos para configurar el entorno de desarrollo en tu máquina local.

Requisitos Previos:

Python 3.9+

Node.js y npm

Git

Instalación:

Clona el repositorio:

git clone https://github.com/tu-usuario/gestion-cal.git
cd gestion-cal

Configura el Backend (Django):

cd backend
pip install -r requirements.txt  # (Asegúrate de crear este archivo)
python manage.py migrate
python manage.py runserver

El backend estará corriendo en http://127.0.0.1:8000.

Configura el Frontend (React):

# Desde otra terminal
cd frontend
npm install
npm start

La aplicación de React estará disponible en http://localhost:3000.

Este README.md es un documento vivo y será actualizado a medida que el proyecto avance.
