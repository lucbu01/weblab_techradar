# Dokumentation WEBLAB Projekt Technologie-Radar

## Inhaltsverzeichnis
- [1. Einführung und Ziele](#1-einführung-und-ziele)
- [2. Randbedingungen](#2-randbedingungen)
- [3. Kontextabgrenzung](#3-kontextabgrenzung)
- [4. Lösungsstrategie](#4-lösungsstrategie)
- [5. Bausteinsicht](#5-bausteinsicht)
- [6. Laufzeitsicht](#6-laufzeitsicht)
- [7. Verteilungssicht](#7-verteilungssicht)
- [8. Querschnittliche Konzepte](#8-querschnittliche-konzepte)
- [9. Architekturentscheidungen](#9-architekturentscheidungen)
- [10. Qualitätsanforderungen](#10-qualitätsanforderungen)
- [11. Risiken und technische Schulden](#11-risiken-und-technische-schulden)
- [12. Glossar](#12-glossar)
- [13. Konfiguration und Umgebungsvariablen](#13-konfiguration-und-umgebungsvariablen)

## 1. Einführung und Ziele

Das Projekt "Technologie-Radar" dient als zentrales Werkzeug für die Verwaltung und Visualisierung von Technologietrends innerhalb einer Organisation. Es unterstützt Entscheidungsträger (CTO, Tech-Leads) bei der strategischen Planung und bietet Mitarbeitern eine strukturierte Übersicht über den aktuellen Technologie-Stack.

(siehe auch [Projektbeschrieb vom Modul](https://github.com/web-programming-lab/web-programming-lab-projekt/blob/main/Technologie-Radar.md))

### Aufgabenstellung
- **Erfassung und Bearbeitung Technologien**: Strukturierte Ablage von Beschreibungen, Kategorien und Reifegraden (Ringen).
- **Visualisierung**: Darstellung der Technologien (Als Liste, tabellarisch oder Radar)
- **Rollenbasiertes System**: Trennung zwischen Administration (Schreiben) und Viewer (Lesen).

### Qualitätsziele
- **Sicherheit**: Schutz der Administrationsdaten durch rollenbasierte Zugriffssteuerung.
- **Benutzerfreundlichkeit**: Intuitive Darstellung und einfache Bedienung, auch auf mobilen Geräten.
- **Wartbarkeit**: Klare Architektur und hohe Testabdeckung.
- **Performance**: Schnelle Ladezeiten (< 1s für den Viewer).
- **Audit-Logging**: Protokollierung administrativer Logins.

---

## 2. Randbedingungen

- **Technologie-Stack**: Angular (Frontend), NestJS (Backend), MongoDB (Datenbank), Keycloak (IAM).
- **Infrastruktur**: Containerisierung mittels Docker und Orchestrierung via Docker Compose.
- **Entwicklung**: Nx Monorepo für konsistente Tooling- und Build-Prozesse.

---

## 3. Kontextabgrenzung

Das System interagiert mit folgenden externen Komponenten:
- **Keycloak**: Externer Identity Provider für die Authentifizierung und Rollenverwaltung.
- **MongoDB**: Dokumentenorientierte Datenbank für die Persistenz der Technologien und Audit-Logs.
- **Browser**: Endgerät des Nutzers zur Interaktion mit der Web-Applikation.

### Fachlicher Kontext
Das Technologie-Radar dient der Verwaltung und Visualisierung von Technologietrends in einer Organisation.
Das UI für Read-Only- (EMPLOYEE) und Admin-User (CTO/TECHLEAD) ist das gleiche. Je nach Rolle werden einfach unterschiedliche Funktionen angezeigt.

#### Rollen 

  - *CTO* (CTO): Berechtigt zur Administration der Technologien über die App und zum Verwalten der Nutzer im Keycloak (Login-Pflicht).
  - *Tech-Lead* (TECHLEAD): Berechtigt zur Administration der Technologien (Login-Pflicht).
  - *Mitarbeiter* (EMPLOYEE): Berechtigt zum Anzeigen der Technologien (Login-Pflicht gemäß Story 7).

#### Kernfunktionen

  - Technologien erfassen (Als Entwurf oder Publikation)
  - Entwürfe publizieren
  - Technologien kategorisieren (Techniques, Tools, Platforms, Languages & Frameworks)
  - Technologien in Ringe einordnen (Adopt, Trial, Assess, Hold)
  - Technologien anzeigen (als Radar oder tabellarisch)

### Technischer Kontext
Das System ist als Webapplikation konzipiert und besteht aus folgenden Komponenten:
- **Frontend (Angular):** Single-Page-Application für die Visualisierung und Verwaltung.
- **Backend (NestJS):** REST-API zur Datenverwaltung und Geschäftslogik.
- **Datenbank (MongoDB):** Speicherung der Technologiedaten und Audit-Logs.
- **Identitätsmanagement (Keycloak):** Authentifizierung und Autorisierung via OIDC.

```mermaid
graph TD
    User([Benutzer]) <--> Frontend[Frontend: Angular]
    Frontend <--> Backend[Backend: NestJS]
    Backend <--> MongoDB[(Datenbank: MongoDB)]
    Frontend <--> Keycloak[Auth: Keycloak]
    Backend <--> Keycloak
    Keycloak <--> Postgres[(Datenbank: Postgres)]
```

### Schnittstellen & API-Dokumentation
Das Backend stellt eine REST-API zur Verfügung. Zur interaktiven Erkundung und als technischer Vertrag zwischen Frontend und Backend wird Swagger/OpenAPI genutzt.
Die vollständige API-Dokumentation ist zur Laufzeit der lokalen Entwicklungsumgebung unter http://localhost:3000/api/docs oder in der publizierten [Live-Demo](https://techradar.lucbu.ch/api/docs) aufrufbar.

---

## 4. Lösungsstrategie

Um die wesentlichen Qualitätsziele und fachlichen Anforderungen des Technologie-Radars zu erfüllen, basiert die Architektur auf folgenden grundlegenden Technologieentscheidungen und Lösungsansätzen:

- **Nx Monorepo (Wartbarkeit):** Sowohl das Frontend (Angular) als auch das Backend (NestJS) werden in TypeScript entwickelt und in einem gemeinsamen Nx Monorepo verwaltet. Dies ermöglicht eine durchgängige Typensicherheit, das Teilen von Datenmodellen (z.B. DTOs und Interfaces) zwischen Client und Server sowie konsistente Build-Prozesse.
- **NestJS & Angular (Typensicherheit):** Nutzung von TypeScript über den gesamten Stack hinweg für bessere Wartbarkeit. Für NestJS wird Jest (Backend-Tests) und für Angular Vitest (Frontend-Tests) verwendet.
- **Delegation von Identity & Access Management (OIDC/Keycloak):** Anstatt eine eigene Authentifizierungslösung zu implementieren, wird das Identitäts- und Zugriffsmanagement vollständig an einen externen Identity Provider (Keycloak) ausgelagert. Die Absicherung erfolgt standardisiert über OpenID Connect (OIDC) und JSON Web Tokens (JWT).
- **Dokumentenorientierte Persistenz (Flexibilität):** Für die Speicherung der Technologien und Audit-Logs wird MongoDB eingesetzt. Das schema-flexible Design erlaubt es, zukünftige Anpassungen an den Technologie-Metadaten unkompliziert vorzunehmen.
- **Containerisierung (Portabilität):** Das gesamte System wird mittels Docker containerisiert und via Docker Compose orchestriert.
- **Automatisierung:** Nutzung von GitHub Actions für automatisierte Builds und Tests bei jedem Commit sowie ESLint/Prettier zur Standardisierung des Code-Styles.

---

## 5. Bausteinsicht

### Ebene 1: Gesamtsystem
- **Client App (Frontend):** Angular-Anwendung mit getrennten Bereichen für **Viewer** (öffentlich für Mitarbeiter) und **Administration** (geschützt für CTO/Tech-Lead).
- **Server App (Backend):** NestJS-Server für Business-Logik, Validierung der Pflichtfelder (Name, Kategorie, Ring, etc.) und Datenpersistenz.
- **Keycloak (IAM):** Zentraler Identity Provider für die Rollen-basierte Anmeldung (`CTO`, `Tech-Lead`, `Mitarbeiter`).
- **MongoDB:** Speichert Technologien inkl. Metadaten (Erfassungs-, Publikations- und Änderungsdatum).

```mermaid
graph LR
    subgraph Browser
        Client[Client App: Angular]
    end
    subgraph Server
        ServerApp[Server App: NestJS]
    end
    subgraph External / Data
        Keycloak[Keycloak]
        MongoDB[(MongoDB)]
        Postgres[(Postgres)]
    end
    
    Server -. "liefert" .-> Client
    Client -- "REST API (JWT)" --> ServerApp
    Client -- "OIDC" --> Keycloak
    ServerApp -- "Mongoose" --> MongoDB
    ServerApp -- "Auth Check" --> Keycloak
    Keycloak --> Postgres
```

### Ebene 2: Server (Bausteine)
- **TechnologyModule:** Verwaltung der Technologien (CRUD, Klassifizierung).
- **AuthModule:** Integration mit OIDC und Rollenprüfung (@Roles Guard).
- **AuditModule:** Protokollierung von sicherheitsrelevanten Ereignissen (z.B. Logins).
- **EnvironmentModule:** Konfigurationsmanagement.

```mermaid
graph TD
    subgraph Server App
        AppModule --> TechnologyModule
        AppModule --> AuthModule
        AppModule --> AuditModule
        AppModule --> EnvironmentModule
        
        TechnologyModule -.-> AuditModule
        TechnologyModule -.-> AuthModule
    end
```

---

## 6. Laufzeitsicht

### Authentifizierung & Autorisierung
1. Der Nutzer öffnet die Webapp.
2. Das Frontend prüft den Login-Status via `angular-auth-oidc-client`.
3. Falls nicht eingeloggt, Weiterleitung zu Keycloak. (Home Seite kann ohne Login angezeigt werden)
4. Nach erfolgreichem Login erhält das Frontend ein JWT.
5. Das Frontend blendet verfügbare Funktionalitäten je nach Rolle ein.
6. Bei API-Anfragen wird das JWT im Authorization-Header mitgesendet.
7. Das Backend validiert das JWT und prüft Berechtigungen (z.B. Admin-Rolle für Schreibzugriffe).

```mermaid
sequenceDiagram
    participant User as Benutzer
    participant App as Frontend (Angular)
    participant Auth as Keycloak
    participant API as Backend (NestJS)
    
    User->>App: Öffnet App
    App->>Auth: Login Request (OIDC)
    Auth-->>User: Login Maske
    User->>Auth: Credentials
    Auth-->>App: ID/Access Token (JWT)
    App->>API: API Request + JWT
    API->>API: Token Validierung
    API-->>App: Daten / Response
```

### Technologie erfassen (Beispiel)
1. User sendet (via Client) POST-Request an `/api/technology`.
2. `AdminLoginAuditInterceptor` registriert ggf. den Zugriff (Beim 1. Aufruf mit diesem Token / einmal pro Login).
3. `TechnologyController` validiert die Eingabe.
4. `TechnologyService` speichert die Daten via Mongoose in MongoDB.

```mermaid
sequenceDiagram
    participant Client as Frontend (Angular)
    participant Interceptor as AdminLoginAuditInterceptor
    participant Ctrl as TechnologyController
    participant Service as TechnologyService
    participant DB as MongoDB
    
    Client->>Interceptor: POST /api/technology (+JWT)
    activate Interceptor
    Note over Interceptor: Prüfe Login-Audit Status
    alt Erster Admin-Zugriff mit Token
        Interceptor->>DB: Speichere Login-Audit
    end
    Interceptor->>Ctrl: Request weiterleiten
    deactivate Interceptor
    
    activate Ctrl
    Note over Ctrl: Validierung (DTO)
    Ctrl->>Service: createTechnology(data)
    deactivate Ctrl
    
    activate Service
    Service->>DB: Mongoose save()
    DB-->>Service: Gespeicherte Daten
    Service-->>Ctrl: Resultat
    deactivate Service
    
    activate Ctrl
    Ctrl-->>Client: 201 Created
    deactivate Ctrl
```

---

## 7. Verteilungssicht

Das System wird mittels Docker containerisiert:
- **NestJS & Angular:** Das Backend hostet das gebaute Frontend statisch (ServeStaticModule). Beides läuft in einem Container oder wird direkt mit Node ausgeführt.
- **Keycloak:** Läuft in einem separaten Container, unterstützt durch eine PostgreSQL-Instanz.
- **MongoDB:** Läuft als eigener Datenbank-Container.
- **Wichtig:**
  - Die App spricht Keycloak **nicht** über den internen Docker-DNS-Namen an, sondern über den **extern erreichbaren Keycloak-Hostnamen** (z. B. per Ingress/Reverse Proxy).
  - Dies ist nur ein Beispiel des Deployments, die Systeme können auch anders (nicht über Docker) deployt werden.

```mermaid
graph TD
    subgraph "Docker Network (intern)"
        KCCont[Container: Keycloak]
        PGCont[Container: Postgres DB]
        MongoCont[Container: MongoDB]

        KCCont --> PGCont
    end

    AppCont[App / NestJS + Angular]
    User([Benutzer / Browser])

    AppCont --> MongoCont
    User --> AppCont
    User --> KCCont

    AppCont --> KCCont
```

---

## 8. Querschnittliche Konzepte

- **Sicherheit:** 
  - Token-basierte Authentifizierung (OIDC/JWT).
  - Role-Based Access Control (RBAC): Nur Nutzer mit Rollen `CTO` oder `Tech-Lead` haben Zugriff auf administrative API-Endpunkte. Die Rolle `Mitarbeiter` hat nur Leserechte auf die Technologien.
- **Logging/Audit:**
  - Gemäß Anforderung werden sämtliche Anmeldungen an der Administration (Rollen `CTO` oder `Tech-Lead`) aufgezeichnet (`AdminLoginAuditInterceptor`).
  - Die Audit-Einträge können in der Datenbank oder über die API `GET /api/audit` (von der Rolle `CTO`) abgefragt werden. Sie werden aber nicht im Client dargestellt.
- **Konfiguration:**
  - Die Anwendung nutzt Umgebungsvariablen zur Konfiguration (OIDC, Datenbanken).
  - Das Frontend bezieht seine Konfiguration dynamisch vom Backend über den Endpunkt `/api/environment`.
- **Datenmodellierung:** 
  - Technologien unterstützen Entwurfs- und Publikationsstatus.
  - Automatisches Tracking von Zeitstempeln (Erstellungsdatum, Publikationsdatum, Änderungsdatum).
    Das Kern-Datenmodell für Technologien (in MongoDB gespeichert) sieht wie folgt aus:
      ```mermaid
      erDiagram
          TECHNOLOGY {
              objectId id PK
              string name
              string description
              enum category "TECHNIQUES, TOOLS, PLATFORMS, LANGS_FRAMEWORKS"
              boolean published
              enum ring "ADOPT, TRIAL, ASSESS, HOLD"
              string classificationDescription
              date createdAt
              date publishedAt
              date updatedAt
          }
      ```
- **Fehlerbehandlung & Resilienz:**
  - Globale Fehlererfassung im Backend via NestJS Exception Filters (z. B. für HTTP-Fehler, Validierungsfehler oder DB-Ausfälle).
  - Im Frontend: HTTP-Interceptor fängt API-Fehler ab und zeigt sie benutzerfreundlich (via Angular Material SnackBar) an.
  - Resilienz: Automatische Retries für MongoDB-Verbindungen (via Mongoose-Options) und Graceful Shutdown bei Container-Ausfällen.
- **Frontend-Architektur:** 
  - Responsive Design für Mobile- und Tablet-Ansicht (SCSS Media Queries).

---

## 9. Architekturentscheidungen

Wichtige architektonische Entscheidungen, die über die Technologieentscheidungen hinausgehen:

- **Strict Separation of Concerns:** 
  *   **Entscheidung:** Das System ist strikt in Frontend und Backend getrennt. Die Kommunikation erfolgt ausschließlich über eine dokumentierte REST-API (Swagger).
  *   **Begründung:** Durch die Trennung von Frontend und Backend wird die Verantwortlichkeit für die jeweiligen Bereiche klar definiert, was zu einer besseren Skalierbarkeit und Wartbarkeit führt. Die REST-API stellt einen klaren Vertrag zwischen den beiden Komponenten her, daher könnte auch eine der beiden Komponenten in Zukunft ausgetauscht werden.

- **Zentralisiertes Shared Library Konzept:** 
   *   **Entscheidung:** Nutzung einer `libs`-Library im Nx Monorepo für alle gemeinsamen Typen und Interfaces.
   *   **Begründung:** Garantiert die Übereinstimmung der Datenmodelle zwischen Frontend und Backend ("Single Source of Truth") und reduziert Redundanz.

- **Deterministische Radar-Positionierung:**
   *   **Entscheidung:** Berechnung der X/Y-Koordinaten im Frontend basierend auf einem deterministischen Seed und der Technologie-ID.
   *   **Begründung:** Verhindert das "Springen" von Punkten bei jedem Neuladen, ohne dass komplexe Koordinaten-Sets in der Datenbank gespeichert werden müssen.

- **Hybrid-Security-Architektur:**
   *   **Entscheidung:** Kombination von OIDC im Frontend und JWT-Validierung im Backend.
   *   **Begründung:** Ermöglicht eine nahtlose User Experience (SSO) bei gleichzeitig maximaler Sicherheit der API-Endpunkte.

- **Audit-Logging via Interceptor:**
   *   **Entscheidung:** Implementierung des Admin-Login-Audits über einen globalen NestJS Interceptor statt in der Service-Schicht.
   *   **Begründung:** Entkoppelt die Audit-Logik von der fachlichen Geschäftslogik und stellt sicher, dass alle administrativen Zugriffe konsistent erfasst werden.

---

## 10. Qualitätsanforderungen

- **Benutzerfreundlichkeit:** 
  - Intuitive Visualisierung der Technologien (tabellarisch/als Radar).
  - Mobile Optimierung: Voll funktionsfähig auf Smartphones und Tablets (Responsive Design).
  - Kontextsensitive Anzeige: Features, welche für eine Rolle nicht verfügbar sind, werden ausgeblendet.
- **Sicherheit:** 
  - Schutz der Administration durch strikte Rollenprüfung (`CTO`, `Tech-Lead`).
  - Schutz der Datenanzeige durch Authentifizierung (`Mitarbeiter`, `CTO`, `Tech-Lead`).
  - Protokollierung kritischer Ereignisse (Login-Audit).
- **Wartbarkeit:** 
  - Hohe Testabdeckung durch automatisierte **Unit- und Integration-Tests**.
  - Konsistenter Code-Style durch ESLint und Prettier.
- **Performance:** 
  - Effiziente Datenbankabfragen durch Indizes auf häufig gefilterte Felder (`published`).
  - Reduzierte Datenmenge bei Abfrage von mehreren Technologien durch Ausblenden von Informationen, welche für die Übersicht nicht wichtig sind.

---

## 11. Risiken und technische Schulden

- **Abhängigkeit von Keycloak:** Das System setzt eine laufende Keycloak-Instanz voraus. Ein Ausfall blockiert den Zugriff auf sämtliche Funktionen (außer der Home-Seite).
- **Clientseitige Positionsberechnung:** Die Positionen im Radar werden im Frontend berechnet. Bei extrem vielen Technologien (> 200 pro Quadrant) könnte die Performance der Initialberechnung sinken (aktuell durch deterministisches Caching und Kollisionsvermeidung optimiert).
- **Manuelle Datenpflege:** Es gibt aktuell keine automatisierte Synchronisation mit externen Quellen (z.B. GitHub/NPM).

---

## 12. Glossar

| Begriff      | Erklärung                                                                                                |
|:-------------|:---------------------------------------------------------------------------------------------------------|
| **Quadrant** | Fachliche Einteilung (Techniques, Tools, Platforms, Languagess & Frameworks).                            |
| **Ring**     | Einstufung der Reife (Adopt, Trial, Assess, Hold).                                                       |
| **OIDC**     | OpenID Connect – Standard für Authentifizierung.                                                         |
| **JWT**      | JSON Web Token – Format für Sicherheits-Token.                                                           |
| **RBAC**     | Role-Based Access Control – Berechtigungen basierend auf Benutzerrollen.                                 |
| **Monorepo** | Softwareentwicklungsstrategie, bei der Code für viele Projekte in demselben Repository gespeichert wird. |

---

## 13. Konfiguration und Umgebungsvariablen

Die Anwendung wird über Umgebungsvariablen konfiguriert. Diese werden vom Backend eingelesen und teilweise über eine API (`/api/environment`) an das Frontend weitergereicht.

| Variable           | Beschreibung                                 | Standardwert (Dev)                                            |
|:-------------------|:---------------------------------------------|:--------------------------------------------------------------|
| `MONGODB_URI`      | Verbindungs-String für MongoDB.              | `mongodb://admin:passwordChangeInProduction@localhost:27017/` |
| `MONGODB_DATABASE` | Name der MongoDB-Datenbank.                  | `techradar`                                                   |
| `OIDC_ISSUER`      | URL des Identity Providers (Keycloak Realm). | `http://localhost:8180/realms/techradar`                      |
| `OIDC_AUDIENCE`    | Erwartete Audience im JWT (Client ID).       | `techradar`                                                   |
| `OIDC_CLIENT`      | Client ID für das OIDC Login (Frontend).     | `techradar`                                                   |

### Infrastruktur (Docker Compose)

Bei der Verwendung von `docker-compose.yml` werden zusätzlich folgende Variablen für die Infrastruktur genutzt:

| Service      | Variable                      | Beschreibung                              |
|:-------------|:------------------------------|:------------------------------------------|
| **Postgres** | `POSTGRES_DB`                 | Datenbankname für Keycloak.               |
|              | `POSTGRES_USER`               | Benutzername für Postgres.                |
|              | `POSTGRES_PASSWORD`           | Passwort für Postgres.                    |
| **Keycloak** | `KC_DB`                       | Datenbankname für Keycloak.               |
|              | `KC_DB_URL`                   | JDBC-URL zur Postgres-DB.                 |
|              | `KC_DB_USERNAME`              | Datenbank-Benutzername für Keycloak.      |
|              | `KC_DB_PASSWORD`              | Datenbank-Passwort für Keycloak.          |
|              | `KC_HOSTNAME`                 | Hostname für Keycloak (z.B. `localhost`). |
|              | `KC_LOG_LEVEL`                | Keycloak Log-Level.                       |
|              | `KC_METRICS_ENABLED`          | Keycloak Metriken aktivieren.             |
|              | `KC_HEALTH_ENABLED`           | Keycloak Health-Check aktivieren.         |
|              | `KC_HOSTNAME`                 | Hostname für Keycloak (z.B. `localhost`). |
|              | `KC_BOOTSTRAP_ADMIN_USERNAME` | Initialer Admin-User.                     |
|              | `KC_BOOTSTRAP_ADMIN_PASSWORD` | Initiales Admin-Passwort.                 |
| **MongoDB**  | `MONGO_INITDB_ROOT_USERNAME`  | Root-Benutzer für MongoDB.                |
|              | `MONGO_INITDB_ROOT_PASSWORD`  | Root-Passwort für MongoDB.                |
 
Ausserdem wird in der lokalen Entwicklungsumgebung beim ersten Start von Keycloak ein vorkonfiguriertes Realm importiert und die MongoDB wird beim ersten Start mit Beispieldaten gefüllt.
