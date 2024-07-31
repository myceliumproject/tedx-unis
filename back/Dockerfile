FROM docker.io/node:18.19.0-slim

RUN apt-get update && apt-get install -y unoconv && rm -rf /var/lib/apt/lists/*

RUN mkdir /app && chown -R node:node /app

USER node

WORKDIR /app

COPY --chown=node:node ./package.json ./package-lock.json ./

RUN npm install

COPY --chown=node:node . .

CMD [ "npm", "run", "start" ]