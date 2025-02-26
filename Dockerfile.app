# Utilizar una imagen base oficial de Node.js
# Uso "alpine" para una imagen más pequeña
FROM node:18-alpine

# Copiar el archivo package.json y package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Copiar código fuente
COPY src/ ./src/

# Instalar las dependencias de la aplicación
RUN npm install

# Exponer el puerto 3000
EXPOSE 3000

# Definir el comando para iniciar la aplicación
CMD ["npm", "start"]