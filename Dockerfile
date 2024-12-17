# Stage 1: Install dependencies and build the Next.js app
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000

# Run the app
CMD ["npm", "start"]
