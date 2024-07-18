# Stage 1: Build the React client
FROM node:14 as build

WORKDIR /app

COPY client/package.json client/package-lock.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Set up the Express server
FROM node:14

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm install

COPY server/ ./
COPY --from=build /app/build ./public

EXPOSE 5000

CMD ["node", "index.js"]
