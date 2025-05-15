
#!/bin/bash

# Build the application with Maven
echo "===== Building Spring Boot Application ====="
mvn clean package

echo "===== Starting Spring Boot Application ====="
java -jar target/wedding-vendor-liaison-1.0.0.jar

echo "===== Application is running! ====="
echo "Your application should be available at: http://localhost:8080/wedding-vendor"
