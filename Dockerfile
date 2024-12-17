# Stap 1: Basis image voor het bouwen
FROM node:18 AS builder

# Stel de werkdirectory in
WORKDIR ./

# Stap 2: Kopieer package.json en package-lock.json (of yarn.lock)
COPY package.json package-lock.json ./

# Stap 3: Installeer afhankelijkheden
RUN npm install


# Stap 4: Kopieer de rest van de applicatie code
COPY . .

# Stap 5: Bouw de Next.js applicatie
RUN npm run build

# Stap 6: Maak de productie image
FROM node:18-alpine AS production

# Stel de werkdirectory in
WORKDIR ./

# Kopieer alleen productie afhankelijke bestanden
COPY --from=builder /package.json ./
COPY --from=builder /package-lock.json ./
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /.next ./.next


# Stel de omgeving in op productie
ENV NODE_ENV=production

# Exposeer poort 3000
EXPOSE 3000

# Start de applicatie
CMD ["npm", "start"]