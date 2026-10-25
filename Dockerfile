# One Node process (no dependencies) serves the static game and its small Jiwe API under the
# path prefix the shared quirklog Ingress routes here. The Jiwe keys arrive as environment
# variables from the paws-for-inspection-secrets Kubernetes Secret, never from the image.
FROM node:20-alpine

ENV NODE_ENV=production PORT=8080 STATIC_DIR=/app/public
WORKDIR /app

COPY server/jiwe.mjs server/server.mjs ./server/
COPY index.html game.js story.js tutorial.js audio.js jiwe.js style.css manifest.webmanifest ./public/
COPY art ./public/art
COPY audio ./public/audio

USER node
EXPOSE 8080
CMD ["node", "server/server.mjs"]
