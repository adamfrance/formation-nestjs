# Énoncés des exercices — Jour 3

Formation « NestJS — API back-end avec TypeScript » — Réf. NEST-SPE. Les énoncés se copient tels quels ; les corrigés sont remis après chaque exercice.

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

## Exercice 3.2-A — L'inscription (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer le module, le contrôleur et le service : `npx nest g module auth`, `npx nest g controller auth --no-spec`, `npx nest g service auth --no-spec` ; importer `UsersModule` dans `AuthModule`.
2. Dans `UsersService`, ajouter `existsByEmail(email)` (avec `existsBy` du repository).
3. Créer `src/auth/dto/register.dto.ts` : `email` (adresse valide), `password` (8 caractères au moins), `fullName` (texte non vide, 100 caractères au plus), `role` facultatif, `student` ou `teacher` seulement.
4. Dans `AuthService`, écrire `register(dto)` : l'adresse en minuscules ; 409 « Cette adresse est déjà utilisée » si elle existe ; le hash avec `bcrypt.hash(…, 10)` ; le compte créé, élève par défaut ; renvoyer `id`, `email`, `fullName` et `role`, sans le hash.
5. Dans `AuthController`, `POST /api/auth/register`.
6. Inscrire Léa (formatrice), puis la réinscrire avec `Lea.Martin@…` ; inscrire un administrateur avec un mot de passe court.

```bash
curl -s -X POST http://localhost:3010/api/auth/register -H 'Content-Type: application/json' -d '{"email":"lea.martin@example.com","password":"motdepasse","fullName":"Lea Martin","role":"teacher"}'
```

Résultat attendu : 201 et le compte, sans hash ; puis 409 ; puis 400 sur le mot de passe et le rôle. Dans `psql`, la colonne `passwordHash` commence par `$2b$10$`.

## Exercice 3.2-B — La connexion (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Dans `src/auth/auth.module.ts`, importer `JwtModule.registerAsync` : le secret lu avec `ConfigService` (`JWT_SECRET`), `expiresIn: '1h'`.
2. Créer `src/auth/dto/login.dto.ts` (`email`, `password`) et `src/auth/auth-user.interface.ts` : `AuthUser`, avec `sub` (l'identifiant), `email` et `role`.
3. Dans `AuthService`, écrire `login(dto)` : chercher le compte avec son hash (`findByEmailWithPassword`, adresse en minuscules) ; comparer avec `bcrypt.compare` ; en cas d'échec, 401 « Adresse ou mot de passe incorrect » ; sinon renvoyer `{ access_token }`, signé avec `jwtService.signAsync`.
4. Dans `AuthController`, `POST /api/auth/login`, avec `@HttpCode(200)`.
5. Se connecter avec Léa, puis avec un mauvais mot de passe, puis avec une adresse inconnue.

Résultat attendu : `{"access_token":"eyJ…"}` ; puis deux 401 identiques.

## Exercice 3.3-A — Toute l'API protégée, sauf le catalogue (20 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer `src/auth/public.decorator.ts` : la constante `IS_PUBLIC_KEY` et le décorateur `Public()`, avec `SetMetadata`.
2. Créer `src/auth/current-user.decorator.ts` : `CurrentUser`, avec `createParamDecorator`, qui renvoie `req.user`.
3. Créer `src/auth/jwt-auth.guard.ts` : laisser passer une route marquée `@Public()` (`reflector.getAllAndOverride`) ; sinon lire l'en-tête `Authorization`, exiger `Bearer`, vérifier le jeton avec `jwtService.verifyAsync` et le ranger dans `req.user` ; 401 « Jeton manquant » ou « Jeton invalide ou expiré ».
4. Dans `AuthModule`, déclarer le guard pour toute l'application : `{ provide: APP_GUARD, useClass: JwtAuthGuard }`.
5. Marquer `@Public()` : l'accueil, `GET /api/courses`, `GET /api/courses/:id`, `GET` des leçons, `register` et `login`.
6. Ajouter `GET /api/auth/profile`, qui renvoie `@CurrentUser()`.
7. Appeler le catalogue sans jeton, puis créer un cours sans jeton, puis `profile` avec le jeton de Léa, puis avec un faux jeton.

```bash
TOKEN=$(curl -s -X POST http://localhost:3010/api/auth/login -H 'Content-Type: application/json' -d '{"email":"lea.martin@example.com","password":"motdepasse"}' | node -p "JSON.parse(require('fs').readFileSync(0)).access_token")
curl -s http://localhost:3010/api/courses -o /dev/null -w '%{http_code}\n'
curl -s -X POST http://localhost:3010/api/courses -H 'Content-Type: application/json' -d '{"title":"Kafka en pratique"}'
curl -s http://localhost:3010/api/auth/profile -H "Authorization: Bearer $TOKEN"
curl -s http://localhost:3010/api/auth/profile -H "Authorization: Bearer abc.def.ghi"
```

La première ligne range le jeton de Léa dans la variable `TOKEN` (`node -p` lit la réponse et en extrait `access_token`) ; `$TOKEN` le réutilise.

Résultat attendu : le catalogue répond 200 ; la création, 401 « Jeton manquant » ; `profile` renvoie `sub`, `email`, `role`, `iat` et `exp` ; le faux jeton, 401 « Jeton invalide ou expiré ».

## Exercice 3.4-A — Seuls les formateurs créent, seul l'auteur modifie (20 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer `src/auth/roles.decorator.ts` : `ROLES_KEY` et `Roles(...roles)`, avec `SetMetadata`.
2. Créer `src/auth/roles.guard.ts` : sans `@Roles`, on passe ; sinon, 403 « Votre rôle ne permet pas cette action » si le rôle du compte n'est pas dans la liste.
3. Le déclarer dans `AuthModule`, **après** le guard JWT : `{ provide: APP_GUARD, useClass: RolesGuard }`.
4. Dans `CoursesController`, `@Roles(Role.Teacher, Role.Admin)` sur la création, la modification et la suppression ; passer `@CurrentUser()` au service.
5. Dans `CoursesService` : à la création, `teacherId` reçoit l'identifiant du compte ; avant une modification ou une suppression, une méthode `assertCanEdit(course, user)` lève 403 « Seul l’auteur du cours ou un administrateur peut le modifier » si le compte n'est ni l'auteur ni administrateur.
6. Dans `LessonsController`, `@Roles(Role.Teacher, Role.Admin)` sur la création d'une leçon.
7. Inscrire Tom (élève) et Sam (formateur), puis ranger les trois jetons ; Tom tente de créer un cours ; Léa en crée un ; Sam tente de le publier ; Léa le publie.

```bash
curl -s -X POST http://localhost:3010/api/auth/register -H 'Content-Type: application/json' -d '{"email":"tom.durand@example.com","password":"motdepasse","fullName":"Tom Durand"}'
curl -s -X POST http://localhost:3010/api/auth/register -H 'Content-Type: application/json' -d '{"email":"sam.petit@example.com","password":"motdepasse","fullName":"Sam Petit","role":"teacher"}'
LEA=$(curl -s -X POST http://localhost:3010/api/auth/login -H 'Content-Type: application/json' -d '{"email":"lea.martin@example.com","password":"motdepasse"}' | node -p "JSON.parse(require('fs').readFileSync(0)).access_token")
TOM=$(curl -s -X POST http://localhost:3010/api/auth/login -H 'Content-Type: application/json' -d '{"email":"tom.durand@example.com","password":"motdepasse"}' | node -p "JSON.parse(require('fs').readFileSync(0)).access_token")
SAM=$(curl -s -X POST http://localhost:3010/api/auth/login -H 'Content-Type: application/json' -d '{"email":"sam.petit@example.com","password":"motdepasse"}' | node -p "JSON.parse(require('fs').readFileSync(0)).access_token")
curl -s -X POST http://localhost:3010/api/courses -H "Authorization: Bearer $TOM" -H 'Content-Type: application/json' -d '{"title":"Kafka en pratique"}'
curl -s -X POST http://localhost:3010/api/courses -H "Authorization: Bearer $LEA" -H 'Content-Type: application/json' -d '{"title":"Kafka en pratique"}'
ID=$(curl -s "http://localhost:3010/api/courses?search=kafka" | node -p "JSON.parse(require('fs').readFileSync(0)).data[0].id")
curl -s -X PATCH http://localhost:3010/api/courses/$ID -H "Authorization: Bearer $SAM" -H 'Content-Type: application/json' -d '{"published":true}'
curl -s -X PATCH http://localhost:3010/api/courses/$ID -H "Authorization: Bearer $LEA" -H 'Content-Type: application/json' -d '{"published":true}'
```

Résultat attendu : Tom, 403 (rôle) ; Léa, 201 avec `teacherId` ; Sam, 403 (auteur) ; Léa, 200.

## Exercice 3.6-A — Tester CoursesService (15 min)

Dossier : `~/projets/formation-nestjs/learnhub`.

1. Créer `src/courses/courses.service.spec.ts`.
2. Préparer un faux repository, `{ findOneBy: vi.fn(), merge: vi.fn(), save: vi.fn() }`, et deux comptes formateurs, Léa et Sam (type `AuthUser`, rôle `Role.Teacher`).
3. Dans `beforeEach` : `vi.clearAllMocks()`, puis `Test.createTestingModule` avec le vrai `CoursesService` et des faux pour `getRepositoryToken(Course)`, `COURSES_SEED` (une liste vide) et `CACHE_MANAGER` (`{ clear: vi.fn() }`).
4. Premier test : `findOne('c1')` renvoie le cours que « trouve » le faux repository, et `findOneBy` a reçu `{ id: 'c1' }`.
5. Deuxième test : le repository ne trouve rien (`null`) : `NotFoundException`.
6. Troisième test : Sam modifie un cours de Léa : `ForbiddenException`, et `save` n'a pas été appelé.
7. Lancer `npm test -- courses`.

Résultat attendu : trois tests réussis.
