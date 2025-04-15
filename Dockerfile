FROM node:18

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the React development server port
EXPOSE 3000

# Use polling for hot reload in Docker
ENV CHOKIDAR_USEPOLLING=true

# Start the React dev server
CMD ["npm", "start"]
