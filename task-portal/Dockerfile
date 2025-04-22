FROM eclipse-temurin:21-jdk-jammy


WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
COPY src ./src
RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

CMD ["java", "-jar", "target/task-portal-0.0.1-SNAPSHOT.jar"]