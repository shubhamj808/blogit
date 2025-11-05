FROM eclipse-temurin:25-jdk

WORKDIR /app

# Download OpenTelemetry Java agent
ADD https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar /app/opentelemetry-javaagent.jar

# Create spring user, logs directory, and set permissions
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    addgroup --system spring && \
    adduser --system spring --ingroup spring && \
    mkdir -p /app/logs && \
    chown -R spring:spring /app && \
    chmod 644 /app/opentelemetry-javaagent.jar

# Copy pre-built jar
COPY target/*.jar app.jar

# Use spring user
USER spring

ENTRYPOINT ["java", "-javaagent:./opentelemetry-javaagent.jar", "-jar", "app.jar"]
