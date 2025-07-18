# MIMO Movies

MIMO Movies es una API de gestión de películas que permite a los usuarios insertar valoraciones y gestionar una lista de seguimiento (watchlist) de películas.

## Requisitos

- Node.js (versión 18 o superior)
- Docker (opcional, para ejecutar la aplicación en un contenedor)

## Instalación

En caso de ejecutarse vía Node.js, para instalar las dependencias habrá que colocarse en la raíz y ejecutar el siguiente comando:

```sh
npm install
```

## Ejecución

Hay tres maneras 

### Node.js en modo desarrollador

Para ejecutar la aplicación en modo desarrollador con `nodemon` se empleará el siguiente comando:

```sh
npm run dev
```

### Node.js en modo producción

Para ejecutar la aplicación en modo producción con `node` se empleará el siguiente comando:

```sh
npm start
```

## Node.js > Pruebas

Para ejecutar las pruebas unitarias con `jest` se empleará el siguiente comando:

```sh
npm test
```

## Docker

También existe la posibilidad de ejecutar esta aplicación en un contenedor Docker. Para ello se empleará el siguiente comando:

```sh
docker run -p 3000:3000 anderpri/mimo-movies:app-macos-sqlite
```

Esto ejecutará la aplicación en un contenedor Docker y la expondrá en el puerto 3000.

## Endpoints

### Películas

- `GET /movies`: Obtiene todas las películas

### Valoraciones

- `GET /movies/:movieId/ratings`: Obtiene todas las valoraciones de una película
- `POST /movies/:movieId/ratings`: Crea una valoración para una película
- `GET /movies/:movieId/ratings/:ratingId`: Obtiene una valoración específica de una película
- `PATCH /movies/:movieId/ratings/:ratingId`: Modifica una valoración de una película
- `DELETE /movies/:movieId/ratings/:ratingId`: Elimina una valoración de una película

### Lista de seguimiento (watchlist)

- `GET /watchlist/:userId`: Obtiene la lista de seguimiento de un usuario
- `POST /watchlist/:userId/items`: Añade una película a la lista de seguimiento de un usuario
- `DELETE /watchlist/:userId/items/:itemId`: Elimina una película de la lista de seguimiento de un usuario

### Sesiones

- `POST /sessions`: Inicia sesión y obtiene un token de acceso