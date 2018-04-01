FROM node:8.11.1

# Create app directory
WORKDIR /usr/src/app

# Create data directory and database files
RUN mkdir data
RUN touch data/cpf_dev.sqlite
RUN touch data/cpf_test.sqlite

# Install app dependencies
# If you are building your code for production
# RUN npm install --only=production
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
