FROM node:lts-slim

WORKDIR /app

# COPY package*.json ./
# COPY package-lock.json ./

# RUN rm -rf node_modules
# RUN rm -rf bhild

COPY . .
RUN npm install --legacy-peer-deps
# RUN npm run dev

EXPOSE 5173

ENTRYPOINT [ "npm", "run", "dev" ]
# COPY entrypoint.sh /
# RUN chmod +x /entrypoint.sh
# RUN npm run build
# CMD ["/entrypoint.sh"]
