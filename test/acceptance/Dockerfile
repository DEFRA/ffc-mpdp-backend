# Step 1: Use an official Node.js runtime as a parent image
FROM node:18

# Create a non-root user and group
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Step 2: Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy the rest of the acceptance test project files
COPY test/acceptance/ ./test/acceptance

# Change ownership of the app directory
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Make the start-tests.sh script executable
RUN chmod +x ./test/acceptance/start-tests.sh

# Set the entrypoint to the start-tests.sh script
ENTRYPOINT ["./test/acceptance/start-tests.sh"]
