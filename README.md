# Fonasa hospitales - servidor

Hola, bienvenido.
En este repositorio conseguiras el código correspondiente a una API REST que cumple con los requisitos solicitados por la prueba técnica enviada.

## Ejecutar
### Requisitos

 - NodeJS se recomienda version LTS 16
 - Servidor de postgresql 
	 - puede utilizar la imagen de docker: https://hub.docker.com/_/postgres

### Ejecución

 1. Clonar el repositorio
 2. Ingresar al directorio y ejecutar comando `npm install`
 3. Construir nuevo archivo `.env` en la raiz del proyecto, siguiendo el ejemplo del archivo `example.env`.
 4. Ejecutar comando `npm run serve`. Verifica en la consola que el sistema construya la base de datos definidas. Se recomienda utilizar dBeaver https://dbeaver.io/ para explorar la base de datos.
 
## Para iniciar

> Se recomienda utilizar Postman https://www.postman.com/downloads/ para explorar los endpoints de la API, para ello importar el archivo: **fonasaHospitals.postman_collection.json** ubicado en la raiz del proyecto.



### Crear un hospital

Es necesario crear un hospital en nuestra base de datos, ya que por defecto la tabla esta vacia. 
Utilizar endpoint hospital -> create
|                |Method                          |Body Ejemplo                         |
|----------------|-------------------------------|-----------------------------|
|createHospital  |`POST`                         | <pre>{<br> "name": "test", <br> "address": "test" <br>}</pre>
    
### Crear consultas
Es necesario crear consultas en nuestra base de datos, ya que por defecto la tabla esta vacia. 
Utilizar endpoint consultant -> create
|                |Method                          |Body Ejemplo                         |
|----------------|-------------------------------|-----------------------------|
|createConsultation  |`POST`                         | <pre>{<br> "specialistName": "test", <br> "type": "urgency - general - pediatry" <br> "hospitalId": "id Hospital created"<br>}</pre>

