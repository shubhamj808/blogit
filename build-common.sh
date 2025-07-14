#!/bin/bash

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