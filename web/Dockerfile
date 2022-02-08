FROM node as build-stage
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ARG REACT_APP_URL
ENV REACT_APP_URL=$REACT_APP_URL
RUN npm run build

FROM nginx
COPY --from=build-stage /app/build /usr/share/nginx/html
# EXPOSE 80