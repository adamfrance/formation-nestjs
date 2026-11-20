import 'reflect-metadata';

// 1. Une fabrique de décorateurs de classe : elle reçoit un paramètre et renvoie le décorateur
function Rayon(nom: string) {
  return (cible: object) => {
    Reflect.defineMetadata('rayon', nom, cible); // colle une étiquette sur la classe
  };
}

// 2. Un décorateur de méthode : il remplace la méthode par une version chronométrée
function Chrono() {
  return (cible: object, nom: string, descripteur: PropertyDescriptor) => {
    const originale = descripteur.value as (...args: unknown[]) => unknown;
    descripteur.value = function (this: unknown, ...args: unknown[]) {
      const debut = performance.now();
      const resultat = originale.apply(this, args); // appelle la vraie méthode
      console.log(`${nom} : ${(performance.now() - debut).toFixed(1)} ms`);
      return resultat;
    };
  };
}

class Catalogue {}

@Rayon('romans')
class Bibliothecaire {
  constructor(private readonly catalogue: Catalogue) {}

  @Chrono()
  chercher(titre: string) {
    let total = 0;
    for (let i = 0; i < 5_000_000; i++) total += i; // un calcul, pour que la durée se voie
    return `Recherche de « ${titre} » terminée (${total > 0 ? 'ok' : '?'})`;
  }
}

// 3. Lire les étiquettes, comme Nest le fait au démarrage
console.log('Rayon :', Reflect.getMetadata('rayon', Bibliothecaire));
console.log('Paramètres du constructeur :', Reflect.getMetadata('design:paramtypes', Bibliothecaire));
console.log(new Bibliothecaire(new Catalogue()).chercher('Dune'));
