
# FROM node:16
# WORKDIR /app
# COPY package*.json ./
# RUN npm i --legacy-peer-deps
# COPY . .

# RUN npm run build
# EXPOSE 5173
# CMD ["npm", "run", "dev"]

# Build stage
# FROM node:16 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --legacy-peer-deps
# COPY . .
# RUN npm run build

# # Production stage
# FROM node:16
# WORKDIR /app
# COPY package*.json ./
# RUN npm install --only=production --legacy-peer-deps

# EXPOSE 5173
# CMD ["npm", "start"]



FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (you need to have a package.json and package-lock.json)
RUN npm i --legacy-peer-deps

# Create a temporary directory and copy the game.physics file from the backend
# RUN mkdir -p /tmp/backend/game
# COPY ../backend/src/game/game.physics /tmp/backend/game/game.physics

# Copy your SvelteKit project files into the container
COPY . .

# Move the game.physics file to the desired location in the frontend directory
# RUN mv /tmp/backend/game/game.physics /frontend/src/game/game.physics

# Build your SvelteKit application
RUN npm run build

# Expose port 5173 for visualization
EXPOSE 5173

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
RUN npm run build
CMD ["/entrypoint.sh"]
