#Nodepop API

Nodepop ofrece un servicio a una app de venta de artículos de segunda mano.

Funciones disponibles desde la API:

* registro del nuevo usuario
* autentificación del usuario
* crear un nuevo anuncio
* seleción de la lista de anuncios
* recibir foto del artículo
* presentación de la lista de tags

Los detalles se puede encontrar en la parte 'Funcionamiento'.

##Arquitectura:

* Primeros pasos:

Antes de arrancar la API hay que instalar todos los módulos usados por la API Nodepop:

```
npm install
```

Para preparar una base de datos de MongoDB, hay que arrancar el instalador de la  base de datos usando el comando:

```
npm run installDB
```

El instalador limpia las coleciones con los Anuncios y los Usuarios (si ya existían antes) y introduce los datos ejemplares a la base de datos. 

A parte de los anuncios crea un nuevo usuario, que se puede usar enviando las peticiones al API. El usuario de test es:

```
{
  "nombre": "Test",
  "clave": "claveSecreta",
  "email": "email@test.es"
}
```

Para arrancar la API sirve un comando:

```
npm run start

```
Despúes de arrancarla, la API esta esperando a las peticiones en el host 127.0.0.1 y puerto 3000.


* Internacionalización

La API proporciona los errores y mensajes del éxito en dos idiomas - inglés y español. Cambio se puede hacer a traves del parámetro *Accept-Language* en el Header. 

* Autenticación

Todas las funcionalidades a parte de autenticación requieren usar un token. Se puede recibrlo durante el proceso de login. Luego se lo usa en el Header (x-access-token) o como el parámetro addicional de las llamadas POST y GET. 

Las contraseñas de los usuarios se guardan el la base de datos como un hash.  

* Registro de los tokens

Si las peticione se envia usando un dispositivo Android o iPad/iPhone se guarda en la base de datos el token, el dispositivo y el email del usuario. 





##Funcionamiento


###1. Registo de nuevo usuario:
**Método:**


``` 
POST /apiv1/usuarios/nuevo
```


**Argumentos:**

* clave : *String, obligatorio, contraseña del usuario*  
* nombre : *String, obligatorio, nombre del usuario*
* email: *String, obligatorio, único, email del usuario* 



**Ejemplo:**

```
{
nombre: 'Nombre',
clave: 'claveSecreta',
email: email@test.es
}
```

Todos los argumentos son obligatorios.
API cambia la clave en un hash y guarda en esta forma en la base de datos. 

**Resultado finalizado con éxito debuelve JSON:**

```
{
  "ok": true,
  "result": "Usuario guardado correctamnte",
  "userEmail": "email@test.es"
}
```

**Posibles errores:**

* Falta alguno de los tres parametros:

```
{
  "ok": false,
  "error": "Falta datos"
}
```

* Tenemos ya un usuario registrado con este mismo email:

```
{
  "ok": "false",
  "error": "Usuario con este email ya existe"
}
```




###2. Autentificación del usuario
**Método:**

```
POST /apiv1/usuarios/authenticate
```

**Argumentos:**

* clave : *String, obligatorio, contraseña del usuario*
* nombre : *String, obligatorio, nombre del usuario*
* email: *String, obligatorio, email del usuario*

**Ejemplo:**

```
{
nombre: 'Nombre',
clave: 'claveSecreta',
email: 'email@test.es'
}
```
Todos los argumentos son obligatorios.

**Resultado finalizado con éxito devuelve JSON:**

```
{
  "ok": true,
  "result": "Autenticación correcta"
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjEwMzA1YzkyMzkzYjgyMDUzNWY0MzkiLCJub21icmUiOiJURVNUIiwiZW1haWwiOiJlbWFpbEBzYXMuZXMiLCJjbGF2ZSI6IiQyYSQxMCRTaW5YdXBUREVZV0xNdWh6L3VSL1VPOXFxUER1VkNnV01qYkNVbGhJVjhaSExSY1pWT2U5YSIsIl9fdiI6MH0.xqoXj321FiO6NuX8eIn2M_n9aA5XYhX3jHyqP__8PTc"
}
```
El proceso devuelve un token, cual sirve para autentificación del usuario. Se requiere usarlo en todas las peticiones a parte de autentificación. Token se puede enviar como:

* un parámetro adicional en URL haciendo las peticiones GET,
* un parámetro adicional en el body del JSON haciendo las peticiones POST,
* en el Header como un argumento de 'x-access-token'

**Posibles errores:**

* Falta alguno de los tres parámetros:

```
{
  "ok": false,
  "error": "Falta datos"
}
```
* No hay usuario con el mismo email y nombre en la base de datos:

```
{
  "ok": "false",
  "error": "Usuario no encontrado"
}
```

* Contraseña es incorrecto:

```
{
  "ok": false,
  "result": "Contraseña incorrecta"
}
```





###3. Creción del nuevo anuncio
**Método:**

```
POST /apiv1/anuncios 
```
**Argumentos:**

* nombre : *String, obligatorio, nombre del artículo;*
* precio : *Number, min:0, obligatorio, precio de venta o precio que el solicitante estaría dipsuesto de pagar por la compra del objeto;*
* venta : *Boolean, obligatorio, típo de anuncio true=venta, false=búsqueda*
* foto : *String, opcional, nombre del fichero con la foto asociada con el anuncio;*
* tags : *Array[String], tags permitidos - 'mobile', 'lifestyle', 'work', 'motor', obligatorio;*

```
{
    "nombre": "Bicicleta",
    "precio": 22,
    "venta": false,
    "foto" : "bici.jpg",
    "tags": [
        "mobile",
        "lifestyle"
    ]
}
```
**Resultado terminado con exito devuelve JSON:**

```
{
  "ok": true,
  "anuncio": {
    "__v": 0,
    "nombre": "Bicicleta",
    "precio": 22,
    "venta": false,
    "foto": "bici.jpg",
    "_id": "561029c778cfdc4c05c0490b",
    "tags": [
      "mobile",
      "lifestyle"
    ]
  }
}
```
**Posibes errores:**

La validación de los campos se hace a traves del Mongoose. Si algún de los campos no cumple los requisitos o falta algún paramatro de los parametros obligatorios se recibirá un error:

```
{
  "ok": false,
  "error": "Error de la validación de los parametros"
}
```


###4. Seleción de los anuncios
**Método:**

```
GET /apiv1/anuncios
```

**Parámetros:**

* nombre : *String, opcional, seleciona artículos que su nombre se empieza con el dato buscado;*
* venta : *Boolean, opcional, seleciona anuncios de compra o venta;*
* tag: *String, seleciona anuncios que contiene tag o tags buscados, modos de usarlo:*

Todos los anuncios que contienen entre sus tags un tag 'mobile':

	tag=mobile

Todos los anuncios que contienen entre sus tags un tag 'mobile' y también 'lifestyle':

	tag=mobile,lifestyle



* precio : *rango del precio, modos de usarlo:*

Precio entre (x,y):
	
		precio=x-y
		
Precio mayor que x:
		
		precio=x-
		
Precio menor que:

		precio=-x
		
		
Precio igual que x:
		
		precio=x
		
* limit : *Numero, min=0, sirve para especificar cuantos resultados tiene que devolver la búsqueda;*
* start : *Numero, min=0, sirve para especificar cunatos primeros resultados tiene que no incluir la búsqueda;*
* sort :  *Numero, por defecto id, permite elegir como ordenar los resultados*
		

**Ejemplos:**

Seleción de sólo dos primeros articulos con el nombre que empieza de 'bi' y con precio mayor que 20:

```
GET /apiv1/anuncios?limit=2&nombre=bi&precio=20-
```
Resultado:

```
{
  "ok": true,
  "result": [
    {
      "_id": "561029a878cfdc4c05c04909",
      "nombre": "Bicicleta",
      "precio": 25,
      "venta": false,
      "__v": 0,
      "tags": [
        "lifestyle"
      ]
    },
    {
      "_id": "561029b478cfdc4c05c0490a",
      "nombre": "Bicicleta",
      "precio": 22,
      "venta": true,
      "__v": 0,
      "tags": [
        "work",
        "lifestyle"
      ]
    }
  ]
}
```


Seleción de los articulos que contienen tag - mobil y lifestyle y con precio menor que 100:

```
GET /apiv1/anuncios?tag=mobile,lifestyle&venta=false&precio=-100
```
Resultado:

```
{
  "ok": true,
  "result": [
    {
      "_id": "561029b478cfdc4c05c0490a",
      "nombre": "iPhone",
      "precio": 30,
      "venta": false,
      "__v": 0,
      "tags": [
        "mobile",
        "lifestyle"
      ]
    },
    {
      "_id": "561029c778cfdc4c05c0490b",
      "nombre": "Mobile",
      "precio": 25,
      "venta": false,
      "foto": "iPhone.jpg",
      "__v": 0,
      "tags": [
        "mobile",
        "lifestyle",
        "work"
      ]
    }
  ]
}
```



###5. Recibir foto del artículo
**Método:**

```
GET /apiv1/anuncios/foto/
```

**Argumentos:**

* nombre del fichero : *String, mandatory, por defecto .jpg*

**Ejemplo de uso:**

```
GET /apiv1/anuncios/foto/ipad.jpg
```

Como resultado la API envia el fichero.




###6. Presentación de los tags
**Método:**

```
GET /apiv1/anuncios/tags
```
La consulta no recibe ningun parametro. 

Devuelve un objeto de tipo JSON con todos los tags que existen en la base de datos. Selciona sólo los valores únicos.

**Resultado finalizado con éxito:**

```
{
  "ok": true,
  "tags": [
    "motor",
    "lifestyle",
    "work"
  ]
}
```
En este caso tenemos en la base sólo tres tags de cuatro permitidos.

 





