FROM node:18-alpine

# Install build dependencies, including setuptools for distutils
RUN apk add --no-cache \
    python3 \
    py3-setuptools \
    make \
    g++ \
    sqlite

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with SQLite3 build
RUN npm install --build-from-source

# Copy the rest of the application
COPY . .

EXPOSE 4000

CMD ["npm", "start"] 