# Stage 1: Build the React application
FROM node:latest as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2: Setup Nginx to serve the React application
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Install Mosquitto MQTT Server
RUN apk add --no-cache mosquitto
COPY mosquitto.conf /mosquitto/config/mosquitto.conf

# Start Nginx and Mosquitto
CMD ["sh", "-c", "nginx -g 'daemon off;' & mosquitto -c /mosquitto/config/mosquitto.conf"]
