# Énoncés des exercices — Jour 2

Formation « NestJS — API back-end avec TypeScript » — Réf. NEST-SPE. Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

## Exercice 2.2-A — Un identifiant pour chaque requête (12 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le middleware : `npx nest g middleware common/request-id --flat --no-spec` (`--flat` : sans sous-dossier).
2. Dans `src/common/request-id.middleware.ts`, lire l'en-tête `x-request-id` de la requête, ou en créer un avec `randomUUID()` s'il manque.
3. Le ranger dans `req.headers['x-request-id']`, pour la suite du trajet, et le renvoyer au client avec `res.setHeader('X-Request-Id', …)`.
4. Dans `src/app.module.ts`, faire implémenter `NestModule` à `AppModule` et brancher le middleware sur toutes les routes (`'{*path}'`).
5. Appeler `curl -s -i http://localhost:3010/api`, puis la même adresse avec `-H 'X-Request-Id: essai-42'`.

Résultat attendu : un en-tête `X-Request-Id` dans chaque réponse ; `essai-42` repris tel quel quand on l'envoie.

## Exercice 2.3-A — Des identifiants vérifiés (5 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans `src/courses/courses.controller.ts`, ajouter `ParseUUIDPipe` sur le paramètre `id` des routes `GET`, `PATCH` et `DELETE /api/courses/:id`.
2. Appeler `curl -s http://localhost:3010/api/courses/abc`.

Résultat attendu : `{"message":"Validation failed (uuid is expected)","error":"Bad Request","statusCode":400}` au lieu du 404.

## Exercice 2.5-A — Le journal des requêtes (12 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer l'intercepteur : `npx nest g interceptor common/logging --flat --no-spec`.
2. Dans `src/common/logging.interceptor.ts`, noter l'heure avant la méthode ; après (avec `tap`), écrire avec un `Logger` nommé `HTTP` : la méthode, l'adresse (`req.originalUrl`), le statut (`res.statusCode`), la durée en millisecondes et l'identifiant de requête (`x-request-id`).
3. Dans `src/main.ts`, le brancher sur toute l'application avec `app.useGlobalInterceptors(…)`.
4. Appeler la liste des cours, créer un cours, puis appeler `/api/courses/abc`.

Résultat attendu : dans le terminal de LearnHub, une ligne `LOG [HTTP] GET /api/courses 200 … ms`, suivie de l'identifiant de la requête entre crochets, par requête réussie ; rien pour la requête refusée.

## Exercice 2.6-A — Une configuration vérifiée (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Installer le module : `npm install @nestjs/config`.
2. Créer `.env` à la racine de `learnhub`, avec le contenu ci-dessous, et une copie nommée `.env.example`.
3. Créer `src/config/env.validation.ts` : une classe `EnvironmentVariables` (`NODE_ENV` parmi `development`, `production`, `test`, par défaut `development` ; `PORT` entier de 1 à 65535, par défaut 3010 ; `DB_HOST`, `DB_USER`, `DB_NAME` textes non vides ; `DB_PORT` entier ; `DB_PASSWORD` texte) et une fonction `validate` qui la vérifie avec `validateSync` et lève une erreur lisible.
4. Dans `src/app.module.ts`, importer `ConfigModule.forRoot({ isGlobal: true, validate })`.
5. Dans `src/main.ts`, lire le port avec `ConfigService`.
6. Arrêter LearnHub, puis le relancer avec un port faux : `PORT=abc npm run start:dev`.

Fichier `learnhub/.env` :

```bash
NODE_ENV=development
PORT=3010
DB_HOST=localhost
DB_PORT=5432
DB_USER=learnhub
DB_PASSWORD=learnhub
DB_NAME=learnhub
```

Les variables `DB_…` serviront cet après-midi, pour PostgreSQL.

Résultat attendu : avec `PORT=abc`, LearnHub refuse de démarrer et affiche « Configuration invalide » ; relancé normalement, il démarre sur le port 3010.

## Exercice 2.7-A — Toutes les erreurs au même format (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le filtre : `npx nest g filter common/all-exceptions --flat --no-spec`.
2. Dans `src/common/all-exceptions.filter.ts`, attraper toutes les erreurs (`@Catch()`) : le statut et le message d'une `HttpException`, sinon 500 et « Erreur interne du serveur ».
3. Écrire dans le journal : `error`, avec la pile d'appels, pour un 500 ; `warn` pour les autres, avec la méthode, l'adresse, le statut et l'identifiant de requête.
4. Répondre avec un objet JSON : `statusCode`, `message`, `path` (l'adresse), `timestamp` (l'heure, au format ISO) et `requestId`.
5. Le brancher dans `src/main.ts` avec `app.useGlobalFilters(…)`.
6. Appeler `/api/courses/abc`, puis un `POST` avec un corps vide, puis `/api/inconnue`.

Résultat attendu : trois réponses au même format, chacune avec son `path` et son `requestId` ; trois lignes `WARN [AllExceptionsFilter]` dans le terminal.

## Exercice 2.8-A — Un catalogue paginé (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer `src/courses/dto/query-courses.dto.ts` : `page` (entier au moins 1, 1 par défaut), `limit` (entier de 1 à 50, 10 par défaut), `search` (texte facultatif de 50 caractères au plus) ; `@Type(() => Number)` sur les nombres.
2. Créer `src/common/page.ts` : une interface générique `Page<T>` avec `data` (les éléments), `total`, `page` et `limit`.
3. Dans `CoursesService.findAll`, recevoir le DTO et renvoyer une `Page<Course>` : la recherche, puis la page demandée (`slice`).
4. Dans `CoursesController.findAll`, recevoir `@Query() query: QueryCoursesDto` et renvoyer la page.
5. Appeler `?limit=2`, puis `?page=2&limit=2`, puis `?limit=100&page=0`.

Résultat attendu : deux cours et `"total":3` ; le troisième cours seul en page 2 ; un 400 qui cite les règles de `page` et de `limit`.

## Exercice 2.9-A — Le catalogue dans PostgreSQL (25 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Supprimer `src/courses/course.model.ts` ; créer `src/courses/course.entity.ts` : l'entité `Course` (table `courses`) avec `id` (UUID), `title` (120 caractères), `description` (texte, vide par défaut), `priceCents` (entier, 0 par défaut), `published` (faux par défaut), `createdAt` et `updatedAt`.
2. Dans `src/courses/courses.module.ts`, importer `TypeOrmModule.forFeature([Course])`.
3. Dans `src/courses/courses.seed.ts`, typer le catalogue de départ en `CreateCourseDto[]`.
4. Réécrire `CoursesService` sur le repository : `onModuleInit` enregistre le catalogue de départ si la table est vide ; `findAll` avec `findAndCount`, `ILike` pour la recherche, tri par titre, `skip` et `take` pour la page ; `findOne` avec `findOneBy` ; `create`, `update` (`merge` puis `save`) et `remove`.
5. Mettre à jour les types des contrôleurs des cours et des leçons (`Promise<…>`) et rendre asynchrones les méthodes de `LessonsService` (`await this.coursesService.findOne(…)`).
6. Créer un cours, le chercher, puis lire la table avec `psql`.

```bash
curl -s -X POST http://localhost:3010/api/courses -H 'Content-Type: application/json' -d '{"title":"Kafka en pratique"}'
docker exec postgres-cours psql -U learnhub -d learnhub -c 'SELECT title, "priceCents", published FROM courses ORDER BY title'
```

Résultat attendu : au démarrage, « Catalogue de départ enregistré : 3 cours » (une seule fois : au démarrage suivant, la table n'est plus vide) ; le cours créé a ses dates ; `psql` affiche quatre cours.

## Exercice 2.10-A — Les leçons dans PostgreSQL (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Supprimer `src/lessons/lesson.model.ts` (le contrôleur des leçons importe alors `Lesson` depuis l'entité) ; créer `src/lessons/lesson.entity.ts` : l'entité `Lesson` (table `lessons`) avec `id` (UUID), `title`, `content` (texte, vide par défaut), `position` (entier), `courseId`, et la relation `@ManyToOne` vers `Course`, avec `onDelete: 'CASCADE'` et `@JoinColumn({ name: 'courseId' })` ; la propriété s'écrit `course: Relation<Course>`, comme dans l'exemple.
2. Dans `src/courses/course.entity.ts`, ajouter le côté `@OneToMany` : `lessons: Relation<Lesson[]>`.
3. Dans `src/lessons/lessons.module.ts`, importer `TypeOrmModule.forFeature([Lesson])`.
4. Réécrire `LessonsService` sur le repository : `findAll` triée par position ; `create` calcule la position avec `countBy({ courseId })`.
5. Créer deux leçons dans « Découvrir NestJS », les lister, puis lire la table : `psql postgres://learnhub:learnhub@localhost/learnhub -c '\d lessons'`.

Résultat attendu : deux leçons, positions 1 et 2 ; dans `\d lessons`, la clé étrangère `courseId` vers `courses(id)` avec `ON DELETE CASCADE`.
