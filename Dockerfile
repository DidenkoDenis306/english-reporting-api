FROM node:20 AS build

RUN apk --no-cache add openssl libc6-compat gcompat curl bash

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# ----------- Production Stage -----------
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

EXPOSE 7654

CMD ["npm", "run", "start:prod"]
