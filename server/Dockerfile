FROM node:20-alpine3.17

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "server"]

EXPOSE 3050