# Énoncés des exercices — Jour 1

Formation « NestJS — API back-end avec TypeScript » — Réf. NEST-SPE. Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 1.2-A — Les deux projets (12 min)

Dossier : `~/projets/formation-nestjs`, à créer.

1. Dans **Git Bash**, créer le dossier `~/projets/formation-nestjs` (`mkdir -p`), puis s'y placer (`cd`).
2. Y créer le projet des exemples : `npx --yes @nestjs/cli@12 new demos --package-manager npm --no-observe` ; à la question « Which module system would you like to use? », garder **ESM (ES Modules) [ with vitest ]**, déjà sélectionné : **Entrée**.
3. Toujours dans `~/projets/formation-nestjs`, y créer LearnHub : `npx --yes @nestjs/cli@12 new learnhub --package-manager npm --no-observe`, avec la même réponse (**Entrée**).
4. Ouvrir le dossier `projets/formation-nestjs` dans VS Code : menu **Fichier > Ouvrir le dossier…**.
5. Ouvrir `demos/src/main.ts` et remplacer le port `3000` par `3001` : LearnHub garde le 3000, et les deux projets tourneront en même temps.

Résultat attendu : « 🚀  Successfully created project demos », puis la même ligne pour `learnhub` (une à deux minutes d'installation par projet) ; dans l'explorateur de VS Code, `demos` et `learnhub` côte à côte ; `3001` dans `demos/src/main.ts`.

## Exercice 1.2-B — L'accueil de LearnHub (8 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans le terminal **learnhub**, se placer dans `~/projets/formation-nestjs/learnhub` (`cd`), puis lancer LearnHub : `npm run start:dev`.
2. Dans `src/app.controller.ts`, renommer la méthode `getHello` en `getWelcome` : clic droit sur son nom, **Renommer le symbole** (touche F2) ; VS Code la renomme partout, test compris.
3. Faire de même dans `src/app.service.ts`.
4. Faire renvoyer par le service l'objet `{ application: 'LearnHub', version: '0.1.0' }` au lieu du texte.
5. Dans le terminal **commandes**, appeler `curl -s http://localhost:3000`.

Résultat attendu : `{"application":"LearnHub","version":"0.1.0"}`.

## Exercice 1.4-A — Le catalogue : la liste et le détail (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le module et le contrôleur des cours : `npx nest g module courses`, puis `npx nest g controller courses --no-spec`.
2. Créer `src/courses/course.model.ts` avec une interface `Course` : `id` (texte), `title`, `description` (textes), `priceCents` (nombre : le prix en centimes), `published` (booléen).
3. Dans `src/courses/courses.controller.ts`, ajouter une propriété `courses` : un tableau de deux cours, avec `id: randomUUID()` (importé de `node:crypto`).
4. Y écrire `GET /api/courses`, qui renvoie la liste.
5. Y écrire `GET /api/courses/:id`, qui renvoie le cours, ou lance une `NotFoundException` avec le message « Cours … introuvable ».
6. Appeler la liste, puis le détail d'un des identifiants reçus, puis `curl -s http://localhost:3000/api/courses/abc`.

Résultat attendu : la liste des deux cours, le détail d'un cours, et `{"message":"Cours abc introuvable","error":"Not Found","statusCode":404}`.

## Exercice 1.4-B — Créer, modifier, supprimer, chercher (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans `src/courses/courses.controller.ts`, faire lire à `GET /api/courses` un paramètre facultatif `search` (`@Query`) : s'il est présent, ne garder que les cours dont le titre le contient, sans tenir compte des majuscules.
2. Y écrire `POST /api/courses` : le corps (`Omit<Course, 'id'>`) devient un cours, avec un nouvel identifiant ; renvoyer le cours.
3. Y écrire `PATCH /api/courses/:id` : modifier seulement les champs envoyés (`Object.assign`), 404 si le cours n'existe pas ; renvoyer le cours.
4. Y écrire `DELETE /api/courses/:id` : retirer le cours, répondre 204.
5. Créer un cours, le retrouver par `?search=`, le publier, le supprimer, avec les commandes ci-dessous.

```bash
curl -s -X POST http://localhost:3000/api/courses -H 'Content-Type: application/json' -d '{"title":"Docker en pratique","description":"Images et conteneurs","priceCents":2900,"published":false}'
curl -s "http://localhost:3000/api/courses?search=docker"
```

Résultat attendu : 201 et le cours créé ; la recherche le trouve ; `PATCH` renvoie `"published":true` ; `DELETE` renvoie 204, et un nouveau `GET` de ce cours, 404.

## Exercice 1.5-A — Le service des cours (12 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le service : `npx nest g service courses --no-spec`.
2. Déplacer dans `src/courses/courses.service.ts` le tableau des cours et le code des cinq routes, en cinq méthodes : `findAll(search?)`, `findOne(id)`, `create(data)`, `update(id, data)`, `remove(id)`.
3. Dans `src/courses/courses.controller.ts`, demander le service dans le constructeur, et faire appeler par chaque route la méthode du service.
4. Rejouer les appels de l'exercice 1.4-B.

Résultat attendu : les mêmes réponses qu'à l'exercice 1.4-B ; le contrôleur ne contient plus ni tableau ni logique.

## Exercice 1.5-B — Le catalogue de départ (12 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer `src/courses/courses.seed.ts` : y exporter un jeton `COURSES_SEED` (le texte `'COURSES_SEED'`) et un tableau `SEED_COURSES` de trois cours sans identifiant (`Omit<Course, 'id'>[]`) : « Découvrir NestJS » (gratuit, publié), « PostgreSQL pour les développeurs » (4900, publié), « Docker en pratique » (2900, non publié).
2. Dans `src/courses/courses.module.ts`, déclarer le provider `{ provide: COURSES_SEED, useValue: SEED_COURSES }`.
3. Dans `src/courses/courses.service.ts`, partir d'un tableau vide, injecter le catalogue de départ avec `@Inject(COURSES_SEED)`, et le charger dans `onModuleInit()` en donnant un identifiant à chaque cours.
4. Y écrire au démarrage, avec un `Logger`, « Catalogue de départ chargé : 3 cours ».

Résultat attendu : au démarrage, la ligne `LOG [CoursesService] Catalogue de départ chargé : 3 cours` ; `GET /api/courses` renvoie les trois cours.

## Exercice 1.6-A — Des cours vérifiés (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Installer les deux bibliothèques : `npm install class-validator class-transformer`.
2. Créer `src/courses/dto/create-course.dto.ts` : `title` texte non vide de 120 caractères au plus ; `description` texte facultatif ; `priceCents` entier positif ou nul, facultatif ; `published` booléen facultatif.
3. Créer `src/courses/dto/update-course.dto.ts` avec `PartialType` de `@nestjs/swagger`.
4. Dans `src/main.ts`, brancher `ValidationPipe` avec `whitelist`, `forbidNonWhitelisted` et `transform`.
5. Dans le contrôleur et le service, remplacer `Omit<Course, 'id'>` et `Partial<…>` par les DTO ; à la création, donner les valeurs par défaut avec `??` (description vide, prix 0, non publié).
6. Rejouer le `POST` avec `{"titre":"faute de frappe"}`, puis créer un cours avec seulement un titre et un prix.

Résultat attendu : un 400 qui liste `property titre should not exist` et les règles de `title` ; un cours créé avec `"description":""` et `"published":false`.

## Exercice 1.6-B — Les leçons d'un cours (20 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le module, le contrôleur et le service des leçons : `npx nest g module lessons`, `npx nest g controller lessons --no-spec`, `npx nest g service lessons --no-spec`.
2. Créer `src/lessons/lesson.model.ts` (interface `Lesson` : `id`, `courseId`, `title`, `content`, `position`) et `src/lessons/dto/create-lesson.dto.ts` (`title` obligatoire, 120 caractères au plus ; `content` facultatif).
3. Écrire `LessonsService` : des leçons en mémoire ; `findAll(courseId)` et `create(courseId, dto)`, qui vérifient d'abord que le cours existe avec `CoursesService.findOne` ; la position d'une nouvelle leçon suit les leçons existantes du cours.
4. Écrire `LessonsController` sur `courses/:courseId/lessons` : `GET` et `POST`, avec `ParseUUIDPipe` sur `courseId`.
5. Lancer l'application et lire l'erreur affichée ; la corriger avec `exports` et `imports`.
6. Créer deux leçons dans un cours, puis les lister ; appeler `GET /api/courses/abc/lessons`.

Résultat attendu : deux leçons de positions 1 et 2 ; `abc` donne 400 (« uuid is expected ») ; un identifiant bien formé mais inconnu donne 404.

## Exercice 1.6-C — Des titres sans espaces parasites (5 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans `src/courses/dto/create-course.dto.ts`, écrire une fonction `trim` qui retire les espaces autour d'un texte et laisse passer toute autre valeur ; l'appliquer à `title` avec `@Transform`, avant ses règles.
2. L'appliquer aussi à `description`.
3. Créer un cours dont le titre et la description ont des espaces autour, puis un cours dont le titre n'est fait que d'espaces ; donner ensuite au premier un titre fait d'espaces, avec un `PATCH`.

```bash
curl -s -X POST http://localhost:3000/api/courses -H 'Content-Type: application/json' -d '{"title":"   Kubernetes en production  ","description":"  Pods, services et déploiements "}'
curl -s -X POST http://localhost:3000/api/courses -H 'Content-Type: application/json' -d '{"title":"   "}'
```

Résultat attendu : le premier cours a un titre et une description nettoyés ; les titres faits d'espaces sont refusés (400, `title should not be empty`), en création comme en modification.

## Exercice 1.6-D — Le contrat pour l'équipe Angular (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans `src/courses/courses.controller.ts`, importer `ApiOperation`, `ApiNotFoundResponse` et `ApiBadRequestResponse` de `@nestjs/swagger` ; donner un résumé (`@ApiOperation`) aux deux routes de lecture, et déclarer le 404 de `GET /api/courses/:id` (`@ApiNotFoundResponse`).
2. Donner un résumé aux trois routes d'écriture ; déclarer le 400 (`@ApiBadRequestResponse`) de la création et de la modification, le 404 de la modification et de la suppression.
3. Vérifier le contrat dans `/docs-json` avec la première commande, puis dans Swagger UI (`http://localhost:3000/docs`).
4. Générer les types TypeScript de l'application Angular avec la seconde commande, puis y retrouver `CreateCourseDto`.

```bash
curl -s http://localhost:3000/docs-json | node -p "const d = JSON.parse(require('fs').readFileSync(0)); Object.entries(d.paths['/api/courses/{id}']).map(([verbe, op]) => verbe + ' : ' + op.summary + ' → ' + Object.keys(op.responses).join(', ')).join('\n')"
npx --yes openapi-typescript@7 http://localhost:3000/docs-json -o generated/learnhub-api.d.ts
```

Résultat attendu : `get : Lire un cours → 200, 404`, `patch : Modifier les champs envoyés → 200, 400, 404`, `delete : Supprimer un cours → 204, 404` ; dans le fichier généré, `CreateCourseDto` avec `title: string` et trois champs facultatifs.

## Exercice 1.7-A — Le projet salles (10 min)

Dossier : `~/projets/formation-nestjs`.

1. Ouvrir un nouveau terminal Git Bash, le nommer **salles**, et y créer le projet (ESM et Vitest aux questions) : `npx --yes @nestjs/cli@12 new salles --package-manager npm --no-observe`.
2. Dans `salles`, installer `@nestjs/swagger`, `class-validator` et `class-transformer`.
3. Dans `src/main.ts` : le préfixe `api`, `ValidationPipe` avec `whitelist`, `forbidNonWhitelisted` et `transform`, Swagger UI sur `/docs` (titre « Salles »), le port 3003.
4. Déclarer le plugin `@nestjs/swagger` dans `nest-cli.json`.
5. Lancer `npm run start:dev`, puis appeler `/api` et `/docs` depuis le terminal **commandes**.

Résultat attendu : `Hello World!` sur `http://localhost:3003/api` ; la page Swagger « Salles » sur `http://localhost:3003/docs`.

## Exercice 1.7-B — Les salles (25 min)

Dossier : `~/projets/formation-nestjs/salles`.

1. Générer le module, le contrôleur et le service `rooms` avec la CLI (`--no-spec`).
2. Créer `src/rooms/room.model.ts` : la liste `EQUIPMENTS` (`as const`), le type `Equipment` qui s'en déduit, l'interface `Room` (`id`, `name`, `capacity`, `equipments`).
3. Créer `src/rooms/dto/create-room.dto.ts` : `name` nettoyé, non vide, 60 caractères au plus ; `capacity` entier de 1 à 200 ; `equipments` facultatif, un tableau sans doublon (`@ArrayUnique`) dont chaque élément est dans `EQUIPMENTS` (`@IsIn` avec `{ each: true }`). Puis `src/rooms/dto/update-room.dto.ts`, avec `PartialType`.
4. Créer `src/rooms/rooms.seed.ts` : le jeton `ROOMS_SEED` et trois salles (Atlas, 8 places, écran et visio ; Bora, 4 places, tableau ; Cassiopée, 20 places, les trois).
5. Écrire `RoomsService` : les salles de départ chargées dans `onModuleInit`, avec un `Logger` ; `findAll`, `findOne` (404), `create`, `update`, `remove` ; un nom déjà pris, sans tenir compte des majuscules, donne 409, en création comme en modification.
6. Écrire `RoomsController` sur `rooms`, avec `ParseUUIDPipe` sur `:id` ; dans `RoomsModule`, fournir les salles de départ et exporter le service.
7. Essayer avec les commandes ci-dessous, dans le terminal **commandes**.

```bash
curl -s http://localhost:3003/api/rooms
curl -s -X POST http://localhost:3003/api/rooms -H 'Content-Type: application/json' -d '{"name":"  Dune ","capacity":6,"equipments":["ecran"]}'
curl -s -X POST http://localhost:3003/api/rooms -H 'Content-Type: application/json' -d '{"name":"atlas","capacity":10}'
curl -s -X POST http://localhost:3003/api/rooms -H 'Content-Type: application/json' -d '{"name":"Europe","capacity":0,"equipments":["ecran","ecran","cafe"]}'
```

Résultat attendu : trois salles ; `Dune` créée, au nom nettoyé ; `atlas` refusé (409) ; `Europe` refusée (400), avec trois messages.

## Exercice 1.7-C — Les réservations (30 min)

Dossier : `~/projets/formation-nestjs/salles`.

1. Générer le module, le contrôleur et le service `bookings` avec la CLI (`--no-spec`).
2. Créer `src/bookings/booking.model.ts` : l'interface `Booking` (`id`, `roomId`, `title`, `start`, `end`, `attendees`).
3. Créer `src/bookings/bookings.constants.ts` : les jetons `CLOCK` et `BOOKING_RULES`, les interfaces `Clock` (`now()`) et `BookingRules` (`maxMinutes`).
4. Créer `src/bookings/dto/create-booking.dto.ts` : `title` nettoyé, non vide, 80 caractères au plus ; `start` et `end`, des dates ISO 8601 strictes (`@IsISO8601({ strict: true })`) ; `attendees`, un entier d'au moins 1.
5. Écrire `BookingsService` : il reçoit `RoomsService`, l'horloge et les règles ; `findAll(roomId)` (404 si la salle n'existe pas, réservations triées par début) ; `create(roomId, dto)`, avec les refus du cahier des charges ; `remove(roomId, id)` (404).
6. Écrire `BookingsController` sur `rooms/:roomId/bookings` (`GET`, `POST`, `DELETE :id` avec 204 ; `ParseUUIDPipe`) ; dans `BookingsModule`, importer `RoomsModule`, fournir l'horloge (`useFactory`) et les règles (`useValue`, 240 minutes).
7. Essayer : réserver Atlas le 20 novembre de 9 h à 10 h 30 pour 6 personnes, puis chaque cas de refus, puis une réservation qui commence à 10 h 30.

```bash
ATLAS=$(curl -s http://localhost:3003/api/rooms | node -p "JSON.parse(require('fs').readFileSync(0)).find((r) => r.name === 'Atlas').id")
curl -s -X POST http://localhost:3003/api/rooms/$ATLAS/bookings -H 'Content-Type: application/json' -d '{"title":"Point produit","start":"2026-11-20T09:00:00+01:00","end":"2026-11-20T10:30:00+01:00","attendees":6}'
```

Résultat attendu : 201 pour le point produit et pour la réservation de 10 h 30 (un créneau qui commence à la fin d'un autre ne le chevauche pas) ; 409 pour un chevauchement ; 400 pour une fin avant le début, plus de 240 minutes, une date passée, 12 personnes dans Atlas, le 31 novembre.

## Exercice 1.7-D — Le contrat des réservations (10 min)

Dossier : `~/projets/formation-nestjs/salles`.

1. Dans `src/bookings/bookings.controller.ts`, donner un résumé à chaque route (`@ApiOperation`).
2. Y déclarer les erreurs : le 404 de la salle (liste et création) et celui de la réservation (annulation) ; le 400 et le 409 de la création (`@ApiConflictResponse`).
3. Vérifier le contrat dans `/docs-json`, puis dans Swagger UI (`http://localhost:3003/docs`).

```bash
curl -s http://localhost:3003/docs-json | node -p "const d = JSON.parse(require('fs').readFileSync(0)); Object.entries(d.paths['/api/rooms/{roomId}/bookings']).map(([verbe, op]) => verbe + ' : ' + op.summary + ' → ' + Object.keys(op.responses).join(', ')).join('\n')"
```

Résultat attendu : `post : Réserver une salle → 201, 400, 404, 409`.

## Exercice 1.7-E — Si vous avez de l'avance : les salles libres (15 min)

Dossier : `~/projets/formation-nestjs/salles`.

1. Générer un contrôleur dans le dossier des réservations : `npx nest g controller bookings/availability --flat --no-spec`.
2. Y écrire `GET /api/availability?start=…&end=…&attendees=…` : les salles assez grandes et libres sur tout le créneau ; `attendees` vaut 1 s'il manque.
3. Dans `BookingsService`, écrire `freeRooms(start, end, attendees)`, qui réutilise `findOverlap` ; 400 si une date ne se lit pas, si la fin précède le début ou si `attendees` n'est pas un entier positif.
4. Réserver Atlas de 9 h à 10 h 30, puis chercher une salle pour 6 personnes de 10 h à 11 h, puis de 11 h à 12 h, puis avec `start=demain` ; dans l'adresse, le `+` du fuseau s'écrit `%2B`.

Résultat attendu : de 10 h à 11 h, Cassiopée seule ; de 11 h à 12 h, Atlas et Cassiopée ; avec `demain`, 400.
