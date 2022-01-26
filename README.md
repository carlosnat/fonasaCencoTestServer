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

> Si no se define un valor para la variable PORT el servidor iniciara en el puerto 3000 por defecto. Quedando el basepath como: http://localhost:3000


### Crear un hospital

Es necesario crear un hospital en nuestra base de datos, ya que por defecto la tabla esta vacia. 
Utilizar endpoint hospital -> create
|Nombre          |Endpoint  |Method                          |Body Ejemplo                         |
|----------------|-|-------------------------------|-----------------------------|
|createHospital  | `/hospital` |`POST`                         | <pre>{<br> "name": "test", <br> "address": "test" <br>}</pre>
    
### Crear consultas
Es necesario crear consultas en nuestra base de datos, ya que por defecto la tabla esta vacia. 
Utilizar endpoint consultant -> create
|Nombre                |Endpoint  |Method                          |Body Ejemplo                         |
|----------------|-|-------------------------------|-----------------------------|
|createConsultation  | `/consultation` |`POST`                         | <pre>{<br> "specialistName": "test", <br> "type": "urgency - general - pediatry" <br> "hospitalId": "id Hospital created"<br>}</pre>

## Funcionalidades
### Generar paciente
El servidor tiene la capacidad de generar de manera aleatoria pacientes, obteniendo datos de la API: https://randomuser.me/ para ello debemos consumir el endpoint patient -> generate
|Nombre          |Endpoint              |Method |Query Param | Respuesta esquema                  
|----------------|----------------------|-------|------------|-|
|patientGenerate  | `/patient/generate` |`GET`  | `hospitalId`  | <pre>{<br> "patient": {} <br> "hospitalRecord": {} <br>}</pre>
> Se requiere el hospitalId para asignar el paciente generado a un hospital

>la Respuesta retorna en la propiedad **patient** el paciente generado y guradado en la tabla "patient" y en la propiedad **hospitalRecord** los datos del paciente asigando al hospital con su prioridad y riesgo almacenados en la tabla hospitalPatient.

