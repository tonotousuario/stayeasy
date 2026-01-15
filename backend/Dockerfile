# Stage 1: Build the application
FROM gradle:jdk21 AS build
WORKDIR /app
COPY . .
RUN gradle build -x test

# Stage 2: Create the final image
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/application.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/application.jar"]
