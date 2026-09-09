# SatQuery AI - Production Frontend Dockerfile (SIH PS-26167)
# Stage 1: Build production assets using Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Optimize layer caching
COPY package*.json ./
RUN npm ci || npm install

# Build args for dynamic backend URLs
ARG VITE_HTTP_BACKEND_URL=http://localhost:7001
ARG VITE_WS_BACKEND_URL=ws://localhost:7001

ENV VITE_HTTP_BACKEND_URL=$VITE_HTTP_BACKEND_URL \
    VITE_WS_BACKEND_URL=$VITE_WS_BACKEND_URL

COPY . .
RUN npm run build

# Stage 2: Serve static bundle via high-performance Nginx
FROM nginx:1.25-alpine AS runner

WORKDIR /usr/share/nginx/html

# Clean default assets
RUN rm -rf ./*

# Copy built production assets from Stage 1
COPY --from=builder /app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:5173/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
