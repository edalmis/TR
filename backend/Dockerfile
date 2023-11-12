FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000 3001 3002

COPY entrypoint.sh /
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
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