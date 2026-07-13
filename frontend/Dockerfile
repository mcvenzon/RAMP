FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Vite default port is 5173, but we'll use 5173 for dev
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
