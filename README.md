# 🚀 E-commerce Simulator

Este proyecto es un simulador simple de una compra de carro de un e-commerce full-stack diseñado para demostrar la integración de una API de cotización de despacho con un carrito de compras. Incluye un frontend React intuitivo y un backend Django REST Framework para manejar la lógica de negocio y la comunicación con el servicio de despacho.

## 📋 Tabla de Contenidos

1.  [Descripción del Proyecto](#-descripción-del-proyecto)
2.  [Características](#-características)
3.  [Tecnologías Utilizadas](#-tecnologías-utilizadas)
4.  [Cómo Levantar el Proyecto](#-cómo-levantar-el-proyecto)
    - [Prerrequisitos](#prerrequisitos)
    - [Clonar el Repositorio](#clonar-el-repositorio)
    - [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
    - [Construir y Ejecutar con Docker Compose](#construir-y-ejecutar-con-docker-compose)
    - [Iniciar el Frontend](#iniciar-el-frontend)
5.  [Uso de la Aplicación](#-uso-de-la-aplicación)
6.  [Endpoints de la API (Backend)](#-endpoints-de-la-api-backend)
7.  [Supuestos](#-supuestos)

---

## 📝 Descripción del Proyecto

El E-commerce Simulator es una aplicación web que simula el flujo de un carrito de compras y el proceso de checkout, con un enfoque especial en la cotización de despachos. El frontend permite generar carritos de compra aleatorios (obteniendo productos de DummyJSON), ver un resumen detallado y cotizar el costo de envío interactuando con una API de backend simulada para Flapp Shipping.

## ✨ Características

- **Generación de Carrito Aleatorio:** Obtiene productos aleatorios de `dummyjson.com` para simular un carrito de compra.
- **Vista de Checkout Detallada:** Muestra un resumen del carrito, incluyendo productos, cantidades y precios.
- **Ingreso de Datos de Envío:** Formulario para capturar nombre, dirección y teléfono del comprador.
- **Cotización de Despacho:** Envía el carrito y los datos de envío al backend para obtener una cotización de despacho simulada de "Flapp Shipping".
- **Gestión del Carrito:**
  - "Limpiar Carrito": Vacía el carrito y regresa a la vista inicial.
  - "Volver": Regresa a la vista inicial manteniendo el carrito actual.
- **Notificaciones:** Uso de `react-hot-toast` para feedback al usuario.

## 🛠️ Tecnologías Utilizadas

**Frontend:**

- **React:** Biblioteca para construir interfaces de usuario.
- **TypeScript:** Superset tipado de JavaScript.
- **Redux Toolkit:** Gestión de estado.
- **Tailwind CSS v4:** Framework CSS para estilos utilitarios.
- **React Router DOM:** Manejo de la navegación.
- **`react-hot-toast`:** Notificaciones tostadas personalizables.
- **`@iconify/react`:** Librería de iconos.
- **`framer-motion`:** Librería para animaciones fluidas (especialmente en transiciones de componentes).
- **Vite:** Herramienta de construcción rápida para desarrollo frontend.

**Backend:**

- **Django:** Framework web para Python.
- **Django REST Framework (DRF):** Conjunto de herramientas para construir APIs REST.
- **Python 3.12:** Lenguaje de programación.
- **`requests`:** Cliente HTTP para hacer peticiones externas.
- **`django-filter`:** Para filtrado de datos en la API.
- **`django-environ`:** Gestión de variables de entorno.
- **`django-cors-headers`:** Manejo de CORS.

**Orquestación y Desarrollo:**

- **Docker:** Contenedorización de la aplicación.
- **Docker Compose:** Orquestación de contenedores (backend, base de datos).

## 🚀 Cómo Levantar el Proyecto

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- [**Git**](https://git-scm.com/): Para clonar el repositorio.
- [**Docker**](https://www.docker.com/get-started/): Para construir y ejecutar los contenedores.
- [**Docker Compose**](https://docs.docker.com/compose/install/): Para orquestar los servicios de la aplicación.

### Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone <https://github.com/diego-dc/ecommerce-simulation>
cd <ecommerce-simulation>
```

### Configuración de Variables de Entorno

El backend utiliza variables de entorno para su configuración.

    Para el Backend:
    Crea un archivo llamado .env en el directorio backend/ con el siguiente contenido. Asegúrate de reemplazar your_django_secret_key_here con una clave secreta fuerte y única.
    Code snippet

    # backend/.env
    # Django settings
    DJANGO_SETTINGS_MODULE=config.django.dev

    # Django Debugging
    DEBUG=True

    # SECRET_KEY is used for cryptographic signing
    SECRET_KEY=your_django_secret_key_here

    # Flapp API Keys for courier services
    FLAPP_API_KEY_UDER="SOLICITAR KEYS"
    FLAPP_API_KEY_TRAELO_YA="SOLICITAR KEYS"

    Puedes generar una SECRET_KEY ejecutando docker-compose exec backend python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())' una vez que el backend esté en funcionamiento.

    SE ENTREGARÁ UN .ENV CON LOS DATOS CORRESPONDIENTES.

### Construir y Ejecutar con Docker Compose

Desde la raíz del proyecto (donde se encuentra docker-compose.yml), ejecuta los siguientes comandos:

Construir las imágenes de Docker:
Este comando construirá las imágenes para el backend, frontend y la base de datos, instalando todas las dependencias.

    docker-compose build

Iniciar los servicios:
Este comando levantará los contenedores del backend, frontend y la base de datos en segundo plano.

    docker-compose up -d

    Para ver los logs de los contenedores en tiempo real, puedes usar docker-compose logs -f.

### Iniciar el Frontend

El frontend se inicia automáticamente con docker-compose up -d ya que está configurado en el docker-compose.yml.

    El frontend debería estar disponible en http://localhost:5173.

    El backend API debería estar disponible en http://localhost:8000.

## 🧭 Uso de la Aplicación

Página Inicial: Accede a http://localhost:5173. Verás dos botones:

    "Generar Carrito": Haz clic para obtener un carrito de compras aleatorio de dummyjson.com. La aplicación mostrará un icono de carrito y un mensaje indicando el número de productos.

    "Finalizar Compra": Una vez que tengas un carrito cargado, haz clic para navegar a la vista de checkout.

Vista de Checkout: Aquí verás el resumen de los productos en tu carrito. Tienes las siguientes opciones:

    "Cotizar Despacho": Te llevará a la vista de ingreso de datos de envío. Si ya los has ingresado, procederá a cotizar.

    "Limpiar Carrito": Vacía el carrito actual y te devuelve a la página inicial.

    "Volver": Te devuelve a la página inicial sin limpiar el carrito.

Vista de Datos de Envío: Completa los campos de nombre, dirección (calle y comuna) y teléfono.

    "Guardar Datos": Guarda la información ingresada.

    "Cotizar Despacho": Envía el carrito y los datos de envío al backend. Si es exitoso, mostrará el costo y el courier; si falla, un mensaje de error. La cotización se mostrará en la vista de checkout.

    "Volver": Regresa a la vista de checkout.

## 🌐 Endpoints de la API (Backend)

El backend expone el siguiente endpoint principal:

POST /api/cart/:

    Descripción: Recibe la información del carrito y los datos del cliente para simular una compra y cotizar el despacho.

    Request Body: Contiene products (lista de productos con productId, price, quantity, discount) y customer_data (nombre, dirección, comuna, teléfono).

    Response: Retorna la mejor opción de despacho (price y courier) o un mensaje de error si no hay envíos disponibles.

## Supuestos

- Los carritos contienen entre **1 y 10 productos aleatorios**, con **1 a 5 unidades** por producto.
- Los precios se aproximan al **segundo decimal**.
- Al volver a la página inicial desde checkout, el carrito **no se borra**.
- Solo se limpia el carrito cuando el usuario lo solicita explícitamente.
- Para el cálculo del despacho se utiliza el **volumen total de cada producto (volumen × cantidad)**.

** EL proyeto quedó configurado para correr en local solamente **
