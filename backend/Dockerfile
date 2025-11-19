# AppProj/backend/Dockerfile

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the backend code
COPY . .

# Build NestJS (outputs to dist/)
RUN npm run build

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main.js"]
