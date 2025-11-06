FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest AS prod

COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80