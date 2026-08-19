# =====================================================================
# MANUFOLIO BACKEND — PRODUCTION DOCKERFILE FOR RENDER
# =====================================================================

# Stage 1: Build Application with Maven & Eclipse Temurin Java 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy Maven POM and source code
COPY pom.xml .
COPY src ./src

# Build production executable fat JAR
RUN mvn clean package -DskipTests=true

# Stage 2: Production JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S manufolio && adduser -S manufolio -G manufolio
USER manufolio:manufolio

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/manufolio-backend-1.0.0.jar app.jar

# Render dynamically sets $PORT environment variable (defaults to 10000)
ENV PORT=10000
EXPOSE 10000

# Launch Spring Boot Application
ENTRYPOINT ["java", "-jar", "app.jar"]
