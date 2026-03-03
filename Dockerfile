FROM node:24-alpine

ENV OIDC_ISSUER=http://keycloak:8180/realms/techradar
ENV OIDC_AUDIENCE=techradar
ENV OIDC_CLIENT=techradar
ENV MONGODB_URI=mongodb://mongodb:27017/
ENV MONGODB_DATABASE=techradar

COPY dist/apps /opt/techradar

WORKDIR /opt/techradar/server

RUN npm ci --omit=dev

EXPOSE 3000

ENTRYPOINT ["node", "main.js"]
