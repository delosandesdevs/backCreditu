![FreeForest](/assets/home_logo.png)

<br>
<br>

<p align="justify"> Free Forest es un proyecto grupal que se desarrolló como prueba técnica de la empresa Creditú. El principal requisito a cumplir fue la puesta en escena de un dashboard de consulta de puntos en una aplicación web de un juego hipotético, el cual también tuvimos que desarrollar conceptualmente y está basado en la concientización del medio ambiente, enfocándonos con profundidad en la forestación, la cual te invitamos a visitarla en el siguiente enlace. </p>  

🌲🌲 [Free Forest](https://delosandes.xyz) 🌲🌲

<br>
<br>
<h1> Primeros pasos 🚀 </h1>

Con las siguientes instrucciones podrás poner en funcionamiento nuestro proyecto localmente .

**📑    Requerimientos**

Para poder poner a correr esta aplicación tendrás que tener instalado en tu ordenador con anterioridad la última versión de NPM y Node, puedes chequear en consola si la tienes instalada haciendo “npm -v” y “node-v”

Sino en el siguiente link puedes descargarla gratuitamente - 

🌐  [NodeJs](https://nodejs.org/es/download/)

Copia el repositorio haciendo click en Fork, así obtendrás una copia del mismo en tu Github.



A continuación haz click en Code, copiando el link del repositorio para clonarlo localmente mediante gitBash o puedes descargar el Zip para luego descomprimirlo en tu computadora.



<br>
<br>
<h1>Para instalar 🛠 </h1>

Llegó el momento para ejecutar en tu ordenador nuestro proyecto.

Abre la consola de tu editor y ejecuta los siguientes comandos.
```sh
   npm install
```

Con este comando descargamos e instalamos todas las dependencias que utilizamos en el proyecto de forma automática. El tiempo de este proceso depende de tu conexión a internet y del poder del procesamiento de tu ordenador, ten paciencia, puede tardar unos minutos.

<br>

<h1>Despliegue Local ⚙️ </h1>

Antes de correr el comando de inicio es necesario crear un archivo .env en la raiz del directorio del proyecto. 

<h2>Parametrización de las variables de entorno 📄 </h2>

En su despliegue local utiliza las siguientes variables de entorno

- DB_NAME_LOCAL  👉 nombre que tendra la base de datos que hayas creado
- DB_USERNAME_LOCAL 👉 nombre de usuario de la base de datos, generalmente es 'postgres' pero eso dependera de como configures tu bd
- DB_HOST_LOCAL     👉 endpoint que te asigne la base de datos, generalmente cuando es local es 'localhost'
- DB_PASSWORD_LOCAL 👉 contraseña que hayas definido para acceder a tu bd
- DB_PORT_LOCAL     👉 puerto de conexion de la base de datos, por ejemplo en PostgreSQL es 5432
- DB_PORT 👉 puerto local, generalmente es 8080

Una vez definidas las variables de entorno, al correr el comando npm run dev, el server detectara que estas en un ambiente de desarrollo y tomara de manera automatica las variables previamente definidas

Para realizar el despliegue local solo necesitas abrir una terminal en la raiz de la carpeta donde guardaste el repositorio en tu computador y ejecutar el comando.

<h2>Ejecución  del proyecto 💻</h2>

```sh
  npm run dev
```

Este comando levantara el servidor y la conexion a la base de datos. Ya estás listo para hacer peticiones!

En el siguiente link vas a tener acceso a la documentación de nuestra API

📄 [Documentación](https://documenter.getpostman.com/view/20723185/VVkMWArr)

<br>

<h1> Ejecución de tests 🛠</h1> 
Los tests fueron desarrollados con el framework Jest y el modulo de node Supertest que permite hacer llamados a las rutas. 

Para empezar a correr los tests solo hay que ejecutar el comando 
```sh
  npm test
```
Tener en cuenta que la base de datos se vera afectada por esta ejecución, por lo que recomendamos que las variables de entorno definidas localmente sean para una db de desarrollo y testeo específicamente.

También está disponible el comando
```sh
  npm run test:cov
```
Esto ejecuta la metrica Code Coverage, que permite conocer la calidad y cuanto de tu codigo está siendo testeado, ayudandote a mejorar y lograr la mayor cobertura posible!
<br>
<br>
<h1> Despliegue productivo </h1>
