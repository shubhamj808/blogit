#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Service names and versions
VERSION="1.0.0"
SERVICES=("user-service" "post-service" "interaction-service" "blogit-frontend")
DOCKER_REGISTRY="blogit"
PROJECT_NAME="blogit"

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}



# Function to build all services
build_services() {
    print_status $BLUE "Building all services..."
    echo "Building parent POM..."
    mvn clean install -N -DskipTests -s settings.xml -U

    echo "Building common module..."
    cd common
    mvn clean install -DskipTests -s ../settings.xml -U
    cd ..

    # Build all services
    services=("user-service" "post-service" "interaction-service")

    for service in "${services[@]}"; do
        echo "Building $service..."
        cd $service
        mvn clean package -DskipTests -s ../settings.xml -U
        cd ..
    done

    echo "Building frontend..."
    cd blogit-frontend
    npm run build
    cd ..

    echo "All services built successfully!"
    if [ $? -ne 0 ]; then
        print_status $RED "Failed to build services"
        exit 1
    fi
    print_status $GREEN "All services built successfully!"
}

# Function to build Docker images
build_docker_images() {
    print_status $BLUE "Building Docker images..."
    for service in "${SERVICES[@]}"; do
        print_status $BLUE "Building $service image..."
        docker build \
            -t "${DOCKER_REGISTRY}/${service}:${VERSION}" \
            -t "${DOCKER_REGISTRY}/${service}:latest" \
            -f "${service}/Dockerfile" \
            "${service}"
        
        if [ $? -ne 0 ]; then
            print_status $RED "Failed to build $service image"
            exit 1
        fi
        print_status $GREEN "$service image built successfully!"
    done
}

# Function to clean up
cleanup() {
    print_status $YELLOW "Cleaning up..."
    docker-compose down -v
}

# Main execution
main() {
    # Clean up any previous builds
    cleanup

    # Build all services
    build_services

    # Build Docker images
    build_docker_images

    # Start services with docker-compose
    print_status $BLUE "Starting services..."
    docker-compose up -d


    print_status $GREEN "All services are running!"
    print_status $CYAN "Service URLs:"
    echo "- User Service: http://localhost:8081"
    echo "- Post Service: http://localhost:8082"
    echo "- Interaction Service: http://localhost:8083"
    echo "- Frontend: http://localhost:5173"
    echo "- Grafana: http://localhost:3000"
    echo "- Prometheus: http://localhost:9090"
}

# Run main function
main "$@"
