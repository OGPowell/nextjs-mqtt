# server/Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port
EXPOSE 3001

# Command to run the app
CMD ["node", "index.js"]
