#!/bin/bash

# Blogit Microservices Management Script
# Usage: ./run.sh [options]
# Options:
#   -b, --build       Build all services before starting
#   -s, --skip-build  Skip building services
#   -c, --clean       Clean all containers and volumes
#   -h, --help        Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
BUILD_SERVICES=false
CLEAN_ALL=false
SHOW_HELP=false

# Service arrays
INFRASTRUCTURE_SERVICES=("postgres" "redis" "kafka" "alloy" "loki" "tempo" "prometheus" "grafana")
APPLICATION_SERVICES=("api-gateway" "user-service" "post-service" "interaction-service")
ALL_SERVICES=("${INFRASTRUCTURE_SERVICES[@]}" "${APPLICATION_SERVICES[@]}")

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print header
print_header() {
    echo -e "${CYAN}"
    echo "=================================================="
    echo "         Blogit Microservices Manager"
    echo "=================================================="
    echo -e "${NC}"
}

# Function to show help
show_help() {
    echo "Usage: ./run.sh [options]"
    echo ""
    echo "Options:"
    echo "  -b, --build       Build all services before starting"
    echo "  -s, --skip-build  Skip building services (default)"
    echo "  -c, --clean       Clean all containers and volumes"
    echo "  -h, --help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run.sh -b                # Build and start all services"
    echo "  ./run.sh --skip-build      # Start services without building"
    echo "  ./run.sh --clean           # Clean all containers and volumes"
    echo ""
    echo "Service URLs (after startup):"
    echo "  🌐 API Gateway:     http://localhost:8080"
    echo "  📚 Swagger UIs:"
    echo "    - User Service:   http://localhost:8081/swagger-ui.html"
    echo "    - Post Service:   http://localhost:8082/swagger-ui.html"
    echo "  📊 Monitoring:"
    echo "    - Grafana:        http://localhost:3000 (admin/admin)"
    echo "    - Prometheus:     http://localhost:9090"
    echo "    - Alloy:          http://localhost:12345"
    echo "    - Loki:           http://localhost:3100"
    echo "    - Tempo:          http://localhost:3200"
    echo "  🎯 Kafka UI:        http://localhost:8090"
    echo ""
}

# Function to build a service
build_service() {
    local service_name=$1
    print_status $BLUE "🔨 Building $service_name..."
    
    if [ -d "$service_name" ]; then
        cd "$service_name"
        if mvn clean package -DskipTests --settings ../settings.xml -q; then
            print_status $GREEN "✅ $service_name built successfully"
        else
            print_status $RED "❌ Failed to build $service_name"
            exit 1
        fi
        cd ..
    else
        print_status $YELLOW "⚠️  Directory $service_name not found, skipping..."
    fi
}

# Function to build all services
build_all_services() {
    print_status $PURPLE "🏗️  Building all services..."
    echo ""
    
    # Only build services that have Maven projects
    local maven_services=("api-gateway" "user-service" "post-service")
    
    for service in "${maven_services[@]}"; do
        build_service "$service"
    done
    
    echo ""
    print_status $GREEN "🎉 All services built successfully!"
    echo ""
}

# Function to clean Docker environment
clean_environment() {
    print_status $YELLOW "🧹 Cleaning Docker environment..."
    
    echo "Stopping all containers..."
    docker-compose down
    
    echo "Removing all containers..."
    docker-compose rm -f
    
    echo "Removing volumes..."
    docker-compose down -v
    
    echo "Pruning Docker system..."
    docker system prune -f
    
    print_status $GREEN "✅ Environment cleaned successfully!"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_status $RED "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    print_status $BLUE "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port/actuator/health" > /dev/null 2>&1; then
            print_status $GREEN "✅ $service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    print_status $YELLOW "⚠️  $service_name may not be fully ready yet"
    return 1
}

# Function to start infrastructure services
start_infrastructure() {
    print_status $PURPLE "🚀 Starting infrastructure services..."
    docker-compose up -d "${INFRASTRUCTURE_SERVICES[@]}"
    
    print_status $BLUE "⏳ Waiting for infrastructure services to be ready..."
    sleep 20
}

# Function to start application services
start_applications() {
    print_status $PURPLE "🎯 Starting application services..."
    docker-compose up -d "${APPLICATION_SERVICES[@]}"
    
    echo ""
    print_status $BLUE "⏳ Waiting for application services to be ready..."
    
    # Wait for key services
    wait_for_service "API Gateway" 8080
    wait_for_service "User Service" 8081
    wait_for_service "Post Service" 8082
}

# Function to show service status
show_service_status() {
    echo ""
    print_status $CYAN "📊 Service Status:"
    docker-compose ps
    
    echo ""
    print_status $CYAN "🔗 Service URLs:"
    echo "  🌐 API Gateway:     http://localhost:8080"
    echo "  📚 Swagger UIs:"
    echo "    - User Service:   http://localhost:8081/swagger-ui.html"
    echo "    - Post Service:   http://localhost:8082/swagger-ui.html"
    echo "  📊 Monitoring:"
    echo "    - Grafana:        http://localhost:3000 (admin/admin)"
    echo "    - Prometheus:     http://localhost:9090"
    echo "    - Alloy:          http://localhost:12345"
    echo "    - Loki:           http://localhost:3100"
    echo "    - Tempo:          http://localhost:3200"
    echo "  🎯 Kafka UI:        http://localhost:8090"
    echo ""
    print_status $CYAN "💡 Useful commands:"
    echo "  📝 View logs:       docker-compose logs -f [service-name]"
    echo "  🔄 Restart service: docker-compose restart [service-name]"
    echo "  🛑 Stop all:        docker-compose down"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--build)
            BUILD_SERVICES=true
            shift
            ;;
        -s|--skip-build)
            BUILD_SERVICES=false
            shift
            ;;
        -c|--clean)
            CLEAN_ALL=true
            shift
            ;;
        -h|--help)
            SHOW_HELP=true
            shift
            ;;
        *)
            print_status $RED "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_header
    
    if [ "$SHOW_HELP" = true ]; then
        show_help
        exit 0
    fi
    
    check_docker
    
    if [ "$CLEAN_ALL" = true ]; then
        clean_environment
        exit 0
    fi
    
    # Interactive mode if no arguments provided
    if [ "$BUILD_SERVICES" = false ] && [ "$#" -eq 0 ]; then
        echo "No options provided. Running in interactive mode..."
        echo ""
        echo "Would you like to:"
        echo "1) Build and start all services"
        echo "2) Start services without building"
        echo "3) Clean environment"
        echo "4) Show help"
        echo ""
        read -p "Enter your choice (1-4): " choice
        
        case $choice in
            1)
                BUILD_SERVICES=true
                ;;
            2)
                BUILD_SERVICES=false
                ;;
            3)
                clean_environment
                exit 0
                ;;
            4)
                show_help
                exit 0
                ;;
            *)
                print_status $RED "Invalid choice. Exiting."
                exit 1
                ;;
        esac
    fi
    
    # Build services if requested
    if [ "$BUILD_SERVICES" = true ]; then
        build_all_services
    fi
    
    # Start services
    print_status $PURPLE "🚀 Starting Blogit microservices..."
    echo ""
    
    start_infrastructure
    start_applications
    
    print_status $GREEN "🎉 All services started successfully!"
    show_service_status
}

# Run main function
main "$@"
