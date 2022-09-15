<div align="center">

![](./Readme/Aspose.Words.ea102fbd-e677-478a-991b-66b51ee3534b.001.png)

</div>

<p align="justify"> Free Forest es un proyecto grupal que se desarrolló como prueba técnica de la empresa Creditú. El principal requisito a cumplir fue la puesta en escena de un dashboard de consulta de puntos en una aplicación web de un juego hipotético, el cual también tuvimos que desarrollar conceptualmente y está basado en la concientización del medio ambiente, enfocándonos con profundidad en la forestación, la cual te invitamos a visitarla en el siguiente enlace. </p>  

https://develop.delosandes.xyz/players

<br>
<br>
<h1> Primeros pasos 🚀 </h1>

Con las siguientes instrucciones podrás poner en funcionamiento nuestro proyecto localmente .

**📑    Requerimientos**

Para poder poner a correr esta aplicación tendrás que tener instalado en tu ordenador con anterioridad la última versión de NPM y Node, puedes chequear en consola si la tienes instalada haciendo “npm -v” y “node-v”

Sino en el siguiente link puedes descargarla gratuitamente - <https://nodejs.org/es/download/> .

Copia el repositorio haciendo click en Fork, así obtendrás una copia del mismo en tu Github.

<div align="center">

![](./Readme/Aspose.Words.ea102fbd-e677-478a-991b-66b51ee3534b.002.png)

</div>

A continuación haz click en Code, copiando el link del repositorio para clonarlo localmente mediante gitBash o puedes descargar el Zip para luego descomprimirlo en tu computadora.

<div align="center">

![](./Readme/Aspose.Words.ea102fbd-e677-478a-991b-66b51ee3534b.003.png)

</div>

<br>
<br>
<h1>Para instalar 🛠 </h1>

Llegó el momento para ejecutar en tu ordenador nuestro proyecto.

Abre la consola de tu editor y ejecuta los siguientes comandos.

- **npm install**

Con este comando descargamos e instalamos todas las dependencias que utilizamos en el proyecto de forma automática. El tiempo de este proceso depende de tu conexión a internet y del poder del procesamiento de tu ordenador, ten paciencia, puede tardar unos minutos.

<h1>Despliegue Local 🛠 </h1>

para realizar el despliegue local solo necesitas abrir una terminal en la raiz de la carpeta donde guardaste el repositorio en tu computador y ejecutar el comando.

- **npm run dev**

este comando levantara el servidor y la conexion a la base de datos los cuales se deben configurar con unas variables de entorno que a continuación te explicamos

<h2>Parametrización de las variables de entorno 🛠 </h2>

este proyecto en su despliegue local utiliza las siguientes variables de entorno

- DB_NAME_LOCAL     => se le debe asignar el nombre que tendra la base de datos que hayas creado
- DB_USERNAME_LOCAL => se le debe asignar el nombre de usuario de la base de datos, generalmente es 'postgres' pero eso dependera de como configures tu bd
- DB_HOST_LOCAL     => se le debe asignar el endpoint que te asigne la base de datos, generalmente cuando es local es 'localhost'
- DB_PASSWORD_LOCAL => se le de asignar el valor de la contraseña que hayas definido para acceder a tu bd
- DB_PORT_LOCAL     => se le debe asignar el puerto de conexion al servidor, regularmente es 8080

una vez definida las variables de entorno, al correr el comando npm run dev, el server detectara que estas en un ambiente de desarrollo y tomara de manera automatica las variables previamente definidas

<h1> Despliegue productivo </h1>
