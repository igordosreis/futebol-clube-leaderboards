# FROM node:16.14-alpine

# WORKDIR /app-frontend

# EXPOSE 3000

# COPY . .

# RUN npm install

# CMD ["npm", "start"]

FROM node:16.14-alpine

WORKDIR /app-frontend

COPY package* ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
