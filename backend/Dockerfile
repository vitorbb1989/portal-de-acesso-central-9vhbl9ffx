FROM node:20-bookworm-slim

RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3333
ENV SEED_ON_START=false

EXPOSE 3333

CMD ["sh", "-c", "mkdir -p /app/data && npx prisma db push && if [ \"$SEED_ON_START\" = \"true\" ] && [ ! -f /app/data/.seeded ]; then npm run db:seed && touch /app/data/.seeded; fi && node dist/index.js"]
