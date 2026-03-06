<div align="center">
  <img alt="WEBLAB Projekt Technologie-Radar von Luca Bucher" src="https://raw.githubusercontent.com/lucbu01/weblab_techradar/refs/heads/main/apps/client/public/favicon.svg" width="200">
</div>

---

<div align="center">
  <a href="https://github.com/lucbu01/weblab_techradar/actions/workflows/build.yml">
    <img alt="CI" src="https://github.com/lucbu01/weblab_techradar/actions/workflows/build.yml/badge.svg">
  </a>
</div>

---

# WEBLAB Projekt Technologie-Radar

Projekt im Modul WEBLAB an der HSLU.

Autor: Luca Bucher

## Links
- [Dokumentation](./Dokumentation.md)
- [Arbeitsjournal](./Arbeitsjournal.md)
- [Fazit und Reflexion](./Reflexion.md)
- [Web Programming Lab Projektauftrag](https://github.com/web-programming-lab/web-programming-lab-projekt/blob/main/README.md)
- [Beschrieb Technologie-Radar](https://github.com/web-programming-lab/web-programming-lab-projekt/blob/main/Technologie-Radar.md)

## Installation

1. NodeJS (LTS-Version 24.X) muss installiert sein.
2. Docker muss installiert sein.
3. Packages müssen intalliert sein (`npm install` im Root-Verzeichnis des Projekts).

## Credentials
Folgende User sind für den lokalen Keycloak aufgesetzt:
- CTO
  - Username: cto
  - Passwort: cto
  - Rolle: CTO
- Tech-Lead
  - Username: techlead
  - Passwort: techlead
  - Rolle: TECHLEAD
- Mitarbeiter
  - Username: employee
  - Passwort: employee
  - Rolle: EMPLOYEE

Das System kann auf live auf [techradar.lucbu.ch](https://techradar.lucbu.ch) ausprobiert werden. Die entsprechenden Credentials sind im Abgabe-File auf Ilias.

## Tasks ausführen

### Infrastruktur (Docker Compose)
Um die benötigte Infrastruktur (Datenbank / Keycloak) zu starten (Docker muss installiert sein und laufen), benutze:

```sh
docker compose --profile app up
```

### NestJS Server mit Angular-Client

Um den NestJS Server (Port 3000) im Produktivmodus (mit integriertem Client) zu starten (Docker Compose muss laufen), benutze in der Kommandozeile:

```sh
npm run start:prod
```
http://localhost:3000/

### NestJS Development-Server

Um den NestJS Dev-Server (Server / Port 3000) zu starten (Docker Compose muss laufen), benutze:

```sh
npm run start:server
```

http://localhost:3000/api/docs

### Angular Development-Server

Um den Angular Dev-Server (Client / Port 4200) zu starten (Server muss laufen), benutze:

```sh
npm run start:client
```

http://localhost:4200/
### Linting

Um das ganze Projekt zu linten, benutze:

```sh
npm run lint
```

### Testing

Um die Unit-Tests für das ganze Projekt auszuführen, benutze:

```sh
npm test
```

### Build

Um ein Bundle für die Produktion zu erstellen, benutze:

```sh
npm run build
cd dist/apps/server
npm ci
```

Alles im `dist` Verzeichnis an den gewünschten Ort kopieren. Im Unterordner `server` (vom `dist` Verzeichnis) kann der Server dann mit `node main.js` gestartet werden.

### Nützliche Nx-Tasks

Um alle verfügbaren Tasks für ein Projekt zu sehen, benutze:

```sh
npm run nx -- show project <client,server,libs>
```

Diese Tasks (targets) werden entweder [automatisch abgeleitet](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) oder im `project.json` oder `package.json` File definiert.

[Mehr dazu in der Nx Dokumentation &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


Um eine Liste aller installierten Nx Plugins zu bekommen, kann  `npm run nx -- list` ausgeführt werden. Danach kann `npm run nx -- list <plugin-name>` ausgeführt werden, um mehr über ein spezifisches Plugin zu erfahren. Alternativ kann die [Nx Console installiert werden](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects), um Plugins und Generatoren in der IDE auszuführen.

[Mehr über Nx Plugins erfahren &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Plugin Registry aufrufen &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
