# Formation NestJS

Formation « NestJS — API back-end avec TypeScript » (3 jours), par ZENITH.

Pendant la formation, vous créez vous-mêmes vos deux projets dans `~/projets/formation-nestjs/` : `demos/` (les
exemples, une médiathèque) et `learnhub/` (le fil rouge, l'API d'une plateforme de formation). Ce dépôt ne contient
au départ que ce fichier.

## Ce que reçoit le dépôt, le soir de chaque journée

| Branche | Contenu |
|---|---|
| `supports` | le support du jour (page HTML) et les énoncés des exercices ; le dernier soir, le support complet des trois jours |
| `jour-1`, `jour-2`, `jour-3` | LearnHub à la fin de la journée (`learnhub/`) |

## Récupérer les supports et le corrigé

Dans Git Bash (sous Windows) ou dans un terminal, le lendemain matin :

```bash
cd ~/projets/formation-nestjs
git clone -b supports https://github.com/adamfrance/formation-nestjs.git supports
git clone -b jour-1 https://github.com/adamfrance/formation-nestjs.git corrige-jour1
```

Les jours suivants : `git -C supports pull`, puis `git clone -b jour-2 …` (ou `jour-3`) dans un nouveau dossier.

Ouvrez les pages HTML dans votre navigateur (double-clic sur le fichier) : GitHub ne les affiche pas en ligne. Le
bouton « Copier » de chaque bloc de code copie le code sans les commentaires.

Le fichier `.env` n'est jamais dans le dépôt : chaque corrigé contient `.env.example`, à copier en `.env`.
