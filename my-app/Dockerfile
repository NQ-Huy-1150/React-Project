# =========================================
# Stage 1: Build the React (Vite) Application
# =========================================

ARG NODE_VERSION=26-alpine
FROM node:${NODE_VERSION} AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# =========================================
# Stage 2: Run
# =========================================
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80