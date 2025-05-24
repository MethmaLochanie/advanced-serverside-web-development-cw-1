# # Build stage for React frontend
# FROM node:18 as client-build
# WORKDIR /app/client
# COPY client/package*.json ./
# RUN npm install
# COPY client/ ./
# RUN npm run build

# # Build stage for Node.js backend
# FROM node:18 as server-build
# WORKDIR /app/server
# COPY server/package*.json ./
# RUN npm install
# COPY server/ ./

# # Production stage
# FROM node:18-slim
# WORKDIR /app

# # Copy built client files
# COPY --from=client-build /app/client/build ./client/build

# # Copy server files
# COPY --from=server-build /app/server ./server

# # Set environment variables
# ENV NODE_ENV=production
# ENV PORT=5000

# # Expose port
# EXPOSE 5000

# # Start the server
# CMD ["node", "server/src/index.js"] 