FROM node
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG APP_URL
ENV APP_URL=$APP_URL
EXPOSE 80
CMD ["npm", "run", "start"]