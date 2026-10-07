# 1) Əsas: hazır, içində Node olan boş Linux
FROM node:20-slim

# 2) Prisma-nın işləməsi üçün lazım olan sistem kitabxanası
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 3) Qutunun içində işləyəcəyimiz qovluq
WORKDIR /app

# 4) Əvvəl yalnız paket siyahısını kopyala, paketləri qur
COPY package*.json ./
RUN npm ci

# 5) İndi qalan kodu kopyala
COPY . .

# 6) Clerk-in public açarı build zamanı lazımdır
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# 7) Prisma-nı hazırla və layihəni build et
RUN DATABASE_URL="postgresql://x:x@localhost:5432/x" npx prisma generate
RUN npm run build

# 8) Qutu işləyəndə 3000 portunda dinləyəcək və bu əmri icra edəcək
EXPOSE 3000
CMD ["npm", "start"]