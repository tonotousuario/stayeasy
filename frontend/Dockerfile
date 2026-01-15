# Use a specific Node.js version for reproducibility. Alpine for a smaller image.
FROM node:20-alpine

# Install pnpm for package management
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies based on the lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application for production
# This executes "tsc -b && vite build" as per package.json
RUN pnpm build

# Vite preview server runs on port 4173 by default.
# You might need to change this if you have a different port configured in vite.config.ts
EXPOSE 4173

# Start the vite preview server.
# The "--host" flag is necessary to expose the server to the network,
# allowing access from outside the container.
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
