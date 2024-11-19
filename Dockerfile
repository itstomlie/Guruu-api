# Base image
FROM --platform=linux/amd64 node:18-slim

# Install SSH server
RUN apt-get update && \
    apt-get install -y openssh-server && \
    mkdir /var/run/sshd

# Define build arguments for username and password
ARG USERNAME
ARG PASSWORD

# Use the arguments to create a user and set the password
RUN useradd -m -s /bin/bash "$USERNAME" && \
    echo "$USERNAME:$PASSWORD" | chpasswd

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the ports for the app and SSH
EXPOSE 3000 22

# Start SSH and then run the Node app
CMD service ssh start && npm run start:prod
