# Use the latest LTS version of Node.js
FROM node:20-alpine
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install

# Build TypeScript
RUN npm run build
 
# Copy the rest of your application files
COPY . .
 
# Expose the port your app runs on
EXPOSE 8080
 
# Define the command to run your app
CMD ["node", "dist/index.js"]
