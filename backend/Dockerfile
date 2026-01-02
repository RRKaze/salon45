FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# build TypeScript to dist/
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
