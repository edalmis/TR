FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# RUN rm -rf node_modules

RUN npm install --legacy-peer-deps
RUN npm install bcryptjs --legacy-peer-deps
# RUN npm rebuild bcrypt --build-from-source
# RUN npm install bcrypt@<version> --legacy-peer-deps


COPY . .

RUN npm run build

EXPOSE 3000 3001 3002

COPY entrypoint.sh /

RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh"]

# FROM node:14-alpine
# # FROM alpine:latest


# # RUN rm -rf node_modules
# # RUN apk update & apk upgrade
# # RUN apk install node:18.15


# WORKDIR /usr/src/app
# # COPY package*.json ./
# COPY . .
# RUN npm install --legacy-peer-deps
# RUN npm install bcryptjs --legacy-peer-deps
# # RUN npm rebuild bcrypt --build-from-source
# # RUN npm install bcrypt@<version> --legacy-peer-deps




# # RUN npm run build
# RUN npm run start:dev

# EXPOSE 3000 3001 3002

# COPY entrypoint.sh /

# RUN chmod +x /entrypoint.sh

# CMD ["/entrypoint.sh"]
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