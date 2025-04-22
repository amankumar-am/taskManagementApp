FROM eclipse-temurin:21-jdk-jammy as builder


WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

# Final runtime image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/target/task-portal-*.jar /app/app.jar

# Expose port (matches your compose file)
EXPOSE 8080


HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]