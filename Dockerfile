# Build Stage
FROM node:22-alpine AS build
ENV CYPRESS_INSTALL_BINARY=0
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=1024" npx vite build --sourcemap false

# Production Stage (Nginx)
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
