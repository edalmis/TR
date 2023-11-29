FROM node:lts-slim

ARG FRONTEND_PORT

WORKDIR /app

COPY . .

ARG FRONTEND_PORT

ENV FRONTEND_PORT=$FRONTEND_PORT

EXPOSE $FRONTEND_PORT

RUN npm install -g npm@latest

RUN npm install --legacy-peer-deps

# COPY entrypoint.sh .

# RUN chmod +x entrypoint.sh && ./entrypoint.sh

ENTRYPOINT [ "npm", "run", "dev" ]

# COPY . .
# RUN npm install --legacy-peer-deps
# # RUN npm run dev

# EXPOSE 5173

# ENTRYPOINT [ "npm", "run", "dev" ]
# COPY entrypoint.sh /
# RUN chmod +x /entrypoint.sh
# RUN npm run build
# CMD ["/entrypoint.sh"]
