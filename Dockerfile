FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy app package and setup
COPY ./appserver/package.json .

RUN yarn install

# Copy app source
COPY ./appserver/dist ./dist

EXPOSE 5000

CMD [ "node", "dist/index.js" ]