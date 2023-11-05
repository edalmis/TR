# Use a Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /frontend/src/app

COPY package*.json ./

# Install dependencies (you need to have a package.json and package-lock.json)
RUN npm i --legacy-peer-deps

# Copy your SvelteKit project files into the container
COPY . .

RUN npm run build
# Expose port 5173 for visualization
EXPOSE 5173


# Build your SvelteKit application
# RUN npm run build


# Specify the command to run your SvelteKit application
CMD ["npm", "run", "dev"]