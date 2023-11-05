FROM node:alpine

WORKDIR /backend/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

EXPOSE 3001

CMD [ "npm", "run", "start:dev"]
# CMD  npm run start

# FROM node:alpine AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /backend/src/app

# COPY package*.json ./

# # COPY --from=development /backend/src/app/ .
# RUN npm install --legacy-peer-deps --only=production

# COPY . .

# COPY --from=development /backend/src/app/dist ./dist

# CMD [ "node", "dist/main" ]