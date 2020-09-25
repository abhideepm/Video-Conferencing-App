FROM node:latest

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

RUN yarn

COPY . .

RUN yarn heroku-postbuild

EXPOSE 5000

CMD ["npm","start"]