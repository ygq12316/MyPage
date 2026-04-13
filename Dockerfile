# Use a Debian-based Node image to avoid native build failures that often happen on Alpine
# (some devDependencies require compilation or Python/build tools). The slightly larger
# image greatly improves compatibility for `npm run build` in CI/Docker.
FROM node:18-bullseye-slim AS builder
WORKDIR /app

# Copy package files and yarn.lock so installs are reproducible
COPY package*.json yarn.lock ./

# Install required native build tools, enable Corepack and use Yarn
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 build-essential make g++ ca-certificates git \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare yarn@stable --activate \
  && yarn install --frozen-lockfile --production=false

COPY . .
RUN yarn build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
