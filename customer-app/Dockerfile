FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/customer-app/package*.json ./apps/customer-app/
RUN npm install
COPY apps/customer-app ./apps/customer-app
RUN npm --workspace=apps/customer-app run build

FROM nginx:alpine
COPY --from=build /app/apps/customer-app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
