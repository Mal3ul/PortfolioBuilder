# syntax=docker/dockerfile:1

###############################################
# Stage 1 — build du frontend React (Vite)
###############################################
FROM node:22-alpine AS build

WORKDIR /app

# Installer les dépendances (frontend + partagées) à partir du lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Construire le bundle statique → /app/dist
COPY . .
RUN npm run build

###############################################
# Stage test — exécute la suite Vitest (deps de dev + sources + tests)
###############################################
FROM build AS test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]

###############################################
# Stage 2 — image runtime (Node sert l'API + dist)
###############################################
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Le package.json racine contient toutes les dépendances runtime du backend
# (express, pg, bcryptjs, jsonwebtoken, nodemailer, body-parser, cors, dotenv).
# node backend/server.js les résout depuis /app/node_modules.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Code backend + bundle frontend construit
COPY backend ./backend
COPY --from=build /app/dist ./dist

# Tourner en utilisateur non-root (présent dans l'image node)
USER node

EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:10000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "backend/server.js"]
