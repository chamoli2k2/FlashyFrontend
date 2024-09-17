# Use an official node image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source files
COPY . .

# Build the application
RUN npm run build

# Install a lightweight server to serve the frontend (e.g., serve)
RUN npm install -g serve

# Expose port 3000 (or whichever port your app runs on)
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", "dist"]
