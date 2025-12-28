# Use an official Node.js, and it should be version 16 and above
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app


#RUN apk add --no-cache --virtual .build-deps alpine-sdk python

# Copy package.json and pnpm-lock.yaml
COPY pnpm-lock.yaml package.json ./usr/src/

# RUN apk add –no-cache make gcc g++ python
# RUN set -x && \
#     retry_cmd="apk add --no-cache make gcc g++ python" && \
#     for i in $(seq 1 3); do \
#         echo "Attempt $i: $retry_cmd"; \
#         eval "$retry_cmd" && break || \
#         if [ $i -eq 3 ]; then \
#             echo "Failed after 3 attempts." && exit 1; \
#         fi; \
#         sleep 5; \
#     done

#Copy all the 
COPY ./ ./

# RUN apk add –no-cache make gcc g++ python
# RUN apk add --no-cache --virtual .gyp python3 make g++
 
#RUN pnpm uninstall bcrypt




# Install app dependencies using PNPM
RUN npm install -g pnpm




# Install dependencies
RUN pnpm i n

# RUN npm install --unsafe-perm=true --allow-root. -- Not working
#RUN pnpm uninstall bcrypt
#RUN pnpm install bcrypt
#RUN pnpm rebuild bcrypt –build-from-source

#RUN apk add --update --no-cache curl py-pip


# RUN apk add --no-cache --virtual .build-deps alpine-sdk python
# RUN pnpm install -g pnpm
# RUN pnpm rebuild bcrypt --build-from-source
# RUN pnpm i
# RUN apk del .build-deps 


# Copy the application code 
COPY . .
# Build the TypeScript code
RUN pnpm run build
# Expose the app
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
#CMD pnpm run build

# syntax=docker.io/docker/dockerfile:1
# syntax=docker.io/docker/dockerfile:1

# FROM node:18-alpine AS base

# # Install dependencies only when needed
# FROM base AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi


# # Rebuild the source code only when needed
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Next.js collects completely anonymous telemetry data about general usage.
# # Learn more here: https://nextjs.org/telemetry
# # Uncomment the following line in case you want to disable telemetry during the build.
# # ENV NEXT_TELEMETRY_DISABLED=1

# RUN \
#   if [ -f yarn.lock ]; then yarn run build; \
#   elif [ -f package-lock.json ]; then npm run build; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# # Production image, copy all the files and run next
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# # Uncomment the following line in case you want to disable telemetry during runtime.
# # ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# ENV PORT=3000

# # server.js is created by next build from the standalone output
# # https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
# ENV HOSTNAME="0.0.0.0"
# CMD ["node", "server.js"]