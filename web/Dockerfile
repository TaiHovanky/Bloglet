FROM node as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG APP_URL
ENV APP_URL=$APP_URL
RUN npm run build

FROM nginx
COPY --from=build-stage /app/build /usr/share/nginx/html
# EXPOSE 80