FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]





