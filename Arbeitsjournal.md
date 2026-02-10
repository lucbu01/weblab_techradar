# Arbeitsjournal WEBLAB Projekt Technologie-Radar

## Freitag, 6. Februar 2026
 - Start: 13:00 Uhr
 - Ende: 17:00 Uhr
 - Aufwand: 4h

Recherche zum Thema Technologieradar und möglichem Tech-Stack. Es wurde ein Beispiel auf [Medium](https://medium.com/create-code/build-a-radar-diagram-with-d3-js-9db6458a9248) gefunden, wie man einen entsprechenden Graphen zeichnen kann. Das Beispiel basiert auf D3.js, evtl. ist es aber auch mit Angular internals umsetzbar.

Weiter wurde der Technologistack etwas abgeändert. Das Frontend und die Datenbank bleiben gleich wie ursprünglich geplant, für das Backend wurde NestJS ausgwählt, welches mittels Nx-Workspace in einem Monorepo mit dem Frontend zusammen (Angular) gebaut wird:

- Frontend: Angular SPA
- Backend: NestJS
- Datenbank: MongoDB
- Monorepo: Nx

## Montag, 9. Februar 2026

### Vormittag
- Start: 08:00 Uhr
- Ende: 12:00 Uhr
- Aufwand: 4h

Der Nx Workspace wurde initial aufgesetzt und einige Anpassungen zu den Default-Einstellugnen gemacht. Zusätzlich zu Frontend und Backend gibt es auch einen libs Ordner für gemeinsame Typescript-Typen (DTOs, ...). Anfangs gab es einige Probleme mit dem Erstellen des Workspaces. Es wurde zuerst versucht einen leeren Workspace zu generieren und danach NestJS und Angular hinzuzufügen. Beim Hinzufügen von Angular gab es dann aber einen Fehler. Deswegen wurde mit dem NX Generator ein Worspace mit einem Angular Projekt erstellt und danach das NestJS Backend und as libs-Projekt hinzugefügt, als Orientierung wurde [dieses Beispiel auf Medium](https://medium.com/@muhammedshibilin/nestjs-monorepo-with-nx-dev-tool-cf06e0d73c02) verwendet. Ebenfalls wurde mal initial ein Konto auf Auth0 und der MongoDB Cloud erstellt. Die beiden Features (Auth und Datenbank) wurden aber noch nicht ins Projekt integriert.

### Nachmittag
- Start: 13:00 Uhr
- Ende: 17:00 Uhr
- Aufwand: 4h

Der Nx Workspace wurde erweitert mit diversen Skripts im package.json und einer proxy-Config für Angular. Ausserdem wurde ein GitHub Repository erstellt und das initiale Projekt-Setup gepusht. Danach wurde das README angepasst und Files für die Dokumentation, Reflexion und das Arbeitsjournal erstellt und es wurde versucht, Auth0 zu integrieren, was nicht so wirklich geklappt hat.

### Abend
- Start: 20:00 Uhr
- Ende: 22:00 Uhr
- Aufwand: 2h

Auth0 wurde noch einmal probiert und es gab weiterhin Probleme. Ebenfalls habe ich herausgefunden, dass im Free-Tier Rollen und feingranulare Berechtigungen nicht möglich sind. Es gibt zwar ein Trial von 20 Tagen, aber das würde bis zum Ende des Projektes nicht reichen. Deswegen werde ich morgen versuchen, Keycloak zu integrieren.

## Dienstag, 10. Februar 2026

### Morgen
- Start: 08:00 Uhr
- Ende: 12:00 Uhr
- Aufwand: 4h

Initial wurde ein docker-compose.yml erstellt mit Keycloak als Auth-Provider, einer PostgreSQL-Datenbank für Keycloak und einer MongoDB für die Techradar-Datenbank. Nach dem initialen Konfigurieren vom Keycloak wurde das erstellte Realm exportiert, dass es bei neuen Workspaces wieder verwendet werden kann. Ausserdem wurde das Frontend mit dem angular-auth-oicd-client an den Keycloak angebunden.

### Nachmittag
- Start: 13:00 Uhr
- Ende: 17:00 Uhr
- Aufwand: 4h

Keycloak wurde nun auch ins Backend integriert. Damit das Frontend nicht wissen muss, welchen Keycloak / Auth Provider es verwenden muss, wurde eine Environment-API im Backend erstellt. Im Backend kann der Auth Provider über Environment-Variablen gesetzt werden. Ein entsprechendes .env-File wurde ebenfalls erstellt. Im Frontend wurde Angular Material integriert und Routen für den Tech-Radar Viewer, die Technologie-Verwaltung und die Benutzer-Verwaltung erstellt und die Routen mittels AuthGuard geschützt.

### Abend
- Start: 20:00 Uhr
- Ende: 24:00 Uhr
- Aufwand: 4h

MongoDB wurde integriert. Für die Technologien wurde eine API erstellt. Momentan ist CREATE und READ möglich. UPDATE und DELETE werden noch kommen. Zur API wurde auch noch Swagger UI integriert, was am Anfang (vor Allem wegen dem Zusammenspiel mit Keycloak) zu Problemen führte, da standardmässig eine falsche Redirect URL mitgeschickt wurde. Dies konnte aber mit einem custom JavaScript gefixt werden.

## Zusammenfassung
Aufwand insgesamt: 26h
