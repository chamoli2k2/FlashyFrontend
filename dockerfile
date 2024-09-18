# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application (assuming npm run build generates files in dist/)
RUN npm run build

# Install 'serve' to serve the dist directory
RUN npm install -g serve

# Expose the port your app will run on
EXPOSE 3000

# Start the application at runtime and serve the dist directory
CMD ["serve", "-s", "dist", "-l", "3000"]
