# WEBLAB Projekt Technologie-Radar

Projekt im Modul WEBLAB an der HSLU.

Autor: Luca Bucher

## Links
- [Dokumentation](./Dokumentation.md)
- [Arbeitsjournal](./Arbeitsjournal.md)
- [Fazit und Reflexion](./Reflexion.md)

## Tasks ausführen

Um die benötigte Infrastruktur (Datenbank / Keycloak) zu starten (Docker muss installiert sein und laufen), benutze:

```sh
docker compose up
```

Um den Angular Dev-Server (Client) zu starten, benutze:

```sh
npm run start:client
```

Um den NestJS Dev-Server (Server) zu starten, benutze:

```sh
npm run start:server
```

Um das ganze Projekt zu linten, benutze:

```sh
npm run lint
```


Um die Unit-Tests für das ganze Projekt auszuführen, benutze:

```sh
npm test
```

Um ein Bundle für die Produktion zu erstellen, benutze:

```sh
npm run build
```

Um alle verfügbaren Tasks für ein Projekt zu sehen, benutze:

```sh
npm run nx -- show project <client,server,libs>
```

Diese Tasks (targets) werden entweder [automatisch abgeleitet](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) oder im `project.json` oder `package.json` File definiert.

[Mehr dazu in der Nx Dokumentation &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)


Um eine Liste aller installierten Nx Plugins zu bekommen, kann  `npm run nx -- list` ausgeführt werden. Danach kann `npm run nx -- list <plugin-name>` ausgeführt werden, um mehr über ein spezifisches Plugin zu erfahren. Alternativ kann die [Nx Console installiert werden](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects), um Plugins und Generatoren in der IDE auszuführen.

[Mehr über Nx Plugins erfahren &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Plugin Registry aufrufen &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
