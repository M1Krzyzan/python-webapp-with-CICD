# Global ARGm available to all stages
ARG WORKDIR="/app"

FROM node:20.16-alpine AS builder

# Set workdir
ARG WORKDIR
WORKDIR ${WORKDIR}

# Copy only package files first (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of frontend source
COPY . .

# Build your app (outputs to dist/)
RUN npm run build

FROM node:20.16-alpine AS runner

# Set workdir
ARG WORKDIR
WORKDIR ${WORKDIR}

# Install serve to serve the production build
RUN npm install -g serve

# Copy only the built output from the builder stage
COPY --from=builder /app/dist dist/

# Expose port 3000
EXPOSE 3000

# Use serve to serve the `dist` folder
CMD ["serve", "-s", "dist", "-l", "3000"]
