#Build stage
FROM node:20-alpine AS build

WORKDIR /src

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:20-alpine AS production

WORKDIR /src

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /src/dist ./dist

CMD ["node", "dist/index.js"]