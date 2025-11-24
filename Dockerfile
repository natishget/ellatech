# ----------------------------------------------------------------------
# 1. DEVELOPMENT/BUILD STAGE
# ----------------------------------------------------------------------
FROM node:20-alpine AS build

# Enable Corepack (which manages pnpm)
RUN corepack enable 

# Set PNPM environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app

# Enable Corepack so pnpm is available in the production image
RUN corepack enable

# Copy lock file and package.json first for cache efficiency
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for Nest CLI)
# The --frozen-lockfile flag ensures deterministic builds
# Use a cache mount for pnpm store to speed up rebuilds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the application
RUN pnpm run build

# ----------------------------------------------------------------------
# 2. RUNTIME STAGE (Production)
# ----------------------------------------------------------------------
FROM node:20-alpine AS production

# Set PNPM environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV production

WORKDIR /usr/src/app

# Only install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Copy compiled code from the build stage
COPY --from=build /usr/src/app/dist ./dist 

# Expose the application port
EXPOSE 3000

# Command to run the compiled application
CMD ["node", "dist/main"]