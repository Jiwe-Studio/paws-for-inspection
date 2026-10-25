# Static game, no build step: nginx serves the repo files under the same
# path prefix the shared quirklog Ingress routes here.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html game.js story.js tutorial.js audio.js style.css manifest.webmanifest /usr/share/nginx/html/games/paws-for-inspection/
COPY art /usr/share/nginx/html/games/paws-for-inspection/art
COPY audio /usr/share/nginx/html/games/paws-for-inspection/audio

EXPOSE 8080
