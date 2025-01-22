FROM node:22.13-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

# Добавить возможность конфигурации
EXPOSE 3000

CMD ["npm", "start"]
