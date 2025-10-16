# 1️⃣ Use official Node.js base image
FROM node:20-alpine

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy package files first for caching layers
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of your app's source code
COPY . .

# 6️⃣ Build TypeScript into JavaScript
RUN npm run build

# 7️⃣ Expose the app port (change if your app uses a different one)
EXPOSE 3000

# 8️⃣ Start the app
CMD ["node", "dist/server.js"]
