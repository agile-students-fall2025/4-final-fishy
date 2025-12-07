# Frontend Dockerfile - Multi-stage build
# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Using npm install instead of npm ci for better compatibility
RUN npm install

# Copy application source
COPY . .

# Build the application
# Pass build args for environment variables
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_MAPS_API_KEY
ARG REACT_APP_UNSPLASH_ACCESS_KEY

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_MAPS_API_KEY=$REACT_APP_GOOGLE_MAPS_API_KEY
ENV REACT_APP_UNSPLASH_ACCESS_KEY=$REACT_APP_UNSPLASH_ACCESS_KEY

RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

