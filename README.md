# Formation NestJS : départ du jour 3

Formation « NestJS — API back-end avec TypeScript » (3 jours), par ZENITH.

Cette branche contient tout ce qu'il faut pour commencer le jour 3, avec le même code pour tout le monde. Nous
reprenons là où le jour 2 s'est arrêté : PostgreSQL est installé, et les exemples y ont leur table `livres`.

| Dossier | Contenu |
|---|---|
| `learnhub/` | LearnHub à la fin de la validation : le trajet d'une requête (middleware, intercepteur, filtre d'erreurs), la configuration validée, la pagination ; le catalogue est encore en mémoire, nous le passons dans PostgreSQL ce matin |
| `demos/` | le projet des exemples (la médiathèque), avec la table `livres` dans PostgreSQL |

## Récupérer la branche

Dans Git Bash (sous Windows) ou dans un terminal. Fermez d'abord VS Code et les terminaux ouverts sur l'ancien dossier
`~/projets/formation-nestjs` : la deuxième commande le met de côté (votre travail des jours 1 et 2 reste dans
`~/projets/formation-nestjs-jour2`). Si ce dossier n'existe pas, elle affiche une erreur sans conséquence.

```bash
mkdir -p ~/projets && cd ~/projets
mv formation-nestjs formation-nestjs-jour2
git clone -b debut-jour-3 https://github.com/adamfrance/formation-nestjs.git formation-nestjs
```

## Vérifier PostgreSQL

PostgreSQL tourne dans le conteneur `postgres-cours`, créé au jour 2 (Docker Desktop démarré) :

```bash
docker ps -a --filter name=postgres-cours --format '{{.Names}} : {{.Status}}'
```

- `postgres-cours : Up …` : il tourne ;
- `postgres-cours : Exited …` : `docker start postgres-cours` ;
- aucune ligne : il n'existe plus, le recréer, avec le compte et la base des exemples :

```bash
docker run --name postgres-cours -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
docker exec postgres-cours pg_isready -U postgres
docker exec postgres-cours psql -U postgres -c "CREATE ROLE mediatheque LOGIN PASSWORD 'mediatheque'"
docker exec postgres-cours psql -U postgres -c "CREATE DATABASE mediatheque OWNER mediatheque"
```

## Installer et lancer les projets

Chaque projet occupe son terminal toute la journée.

Premier terminal, LearnHub :

```bash
cd ~/projets/formation-nestjs/learnhub
npm install
cp .env.example .env
npm run start:dev
```

Deuxième terminal, les exemples :

```bash
cd ~/projets/formation-nestjs/demos
npm install
cp .env.example .env
npm run start:dev
```

`.env` n'est jamais dans le dépôt : `.env.example` donne les mêmes réglages.

Résultat attendu : LearnHub répond sur `http://localhost:3010/api/courses` (Swagger UI sur
`http://localhost:3010/docs`) et les exemples sur `http://localhost:3001/api/livres`.
