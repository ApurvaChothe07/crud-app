# ==========================================
# Multi-stage Dockerfile for Spring Boot Backend
# ==========================================

# Stage 1: Build stage
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy pom.xml and pre-fetch dependencies (efficient layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and compile jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Run as non-privileged system user for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

# Copy compiled executable JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Render assigns a dynamic port via the PORT environment variable
ENV PORT=8080
EXPOSE 8080

# Launch application with dynamic port binding
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
