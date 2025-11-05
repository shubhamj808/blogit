# Dockerfile for Blogit Frontend (React + Vite + Tailwind)
FROM nginx:1.29-alpine

# Install basic tools
RUN apk add --no-cache curl && \
    mkdir -p /usr/share/nginx/html

# Copy the built static files
COPY dist/ /usr/share/nginx/html/

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Validate nginx configuration
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
