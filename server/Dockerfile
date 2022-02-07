FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

ARG REDIS_URL
ARG REDIS_PORT
ARG SESSION_SECRET

# After the files were copied, build/compile the ts. Built app now lives in dist
RUN npm run build
# Copy over the ormconfig.json to the dist folder
COPY ormconfig.json ./dist/
# Set the working directory to /dist so that "node index.js" is running from there
WORKDIR /usr/app/dist

EXPOSE 3001
CMD node index.js
