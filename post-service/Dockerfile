FROM eclipse-temurin:21-jdk

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
# Download OpenTelemetry Java agent
RUN wget -O opentelemetry-javaagent.jar https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar

# Create spring user
RUN addgroup --system spring && adduser --system spring --ingroup spring

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chown -R spring:spring /app/logs

# Copy pre-built jar
COPY target/*.jar app.jar

# Use spring user
USER spring

ENTRYPOINT ["java", "-javaagent:./opentelemetry-javaagent.jar", "-jar", "app.jar"]