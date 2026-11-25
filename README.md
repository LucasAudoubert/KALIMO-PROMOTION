# Les Jardins de Vauban — site de commercialisation

Site vitrine et de collecte de demandes pour le programme **Les Jardins de
Vauban**, commercialisé par **Kalimo**.

Le site présente les lots disponibles, permet de filtrer par typologie et
envoie les demandes dans une base Airtable. Il fonctionne sans Airtable en
**mode démonstration** (données fictives, aucune demande enregistrée), ce qui
permet de le déployer et de le montrer immédiatement.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Airtable** comme base de suivi commercial
- **Vercel** pour l'hébergement
- **GitHub** pour le code
- Aucune dépendance UI, aucun cookie, aucune police externe

Un seul projet couvre le front et l'API. Le token Airtable reste côté serveur.

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir <http://localhost:3000>. Sans variables d'environnement, le site tourne
en mode démonstration avec 12 lots fictifs.

Pour brancher Airtable :

```bash
copy .env.example .env.local
```

Renseigner `AIRTABLE_TOKEN` et `AIRTABLE_BASE_ID` dans `.env.local`, puis
redémarrer `npm run dev`.

Commandes utiles :

```bash
npm run typecheck   # vérification TypeScript
npm test            # test de la couche Airtable (API mockée)
npm run build       # build de production
npm run start       # serveur de production local
```

## Variables d'environnement

| Variable | Portée | Rôle |
| --- | --- | --- |
| `AIRTABLE_TOKEN` | serveur | Token personnel Airtable (lecture + écriture, une seule base) |
| `AIRTABLE_BASE_ID` | serveur | ID de la base (`appXXXXXXXXXXXXXX`) |
| `AIRTABLE_LOTS_TABLE` | serveur | Nom de la table des lots (`Lots` par défaut) |
| `AIRTABLE_DEMANDES_TABLE` | serveur | Nom de la table des demandes (`Demandes` par défaut) |
| `NEXT_PUBLIC_SITE_URL` | public | URL publique du site (métadonnées, sitemap) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public | Email affiché sur le site |
| `RATE_LIMIT_SALT` | serveur | Sel optionnel pour le hachage des IP du rate limit |

> Tout ce qui est préfixé `NEXT_PUBLIC_` est visible dans le navigateur. Le
> token Airtable ne doit **jamais** porter ce préfixe.

## Airtable

Le mode opératoire complet (schéma, import CSV, vue Commercial, automatisation
email, création du token) est dans [`airtable/README.md`](airtable/README.md).
Le fichier [`airtable/lots.csv`](airtable/lots.csv) contient les 12 lots de
démonstration à importer.

> Le plan gratuit Airtable est limité (1 000 enregistrements par base, nombre
> d'éditeurs et exécutions d'automatisation restreints). Pour un lancement,
> c'est suffisant ; vérifier la limite avant une campagne de longue durée.

Les noms de champs doivent correspondre exactement à ceux du code :

- **Lots** : `Référence`, `Type`, `Surface (m²)`, `Étage`, `Prix (€)`, `Statut`,
  `Nb demandes`
- **Demandes** : `ID`, `Nom`, `Email`, `Téléphone`, `Message`, `Lot concerné`,
  `Consentement`, `Version du texte de consentement`, `Reçue le`, `Traitement`

Le code n'écrit que dans `Demandes`. Il ne modifie jamais `Lots`.

## Fonctionnement

```
Navigateur
   │  GET /?type=T3
   ▼
Page serveur (app/page.tsx)
   │  getLots()  →  API Airtable (cache 60 s)
   ▼
HTML + cartes de lots
   │  clic « Ça m'intéresse »
   ▼
/demande?lot=A-103  →  formulaire
   │  POST /api/demandes (JSON)
   ▼
Validation serveur + honeypot + rate limit
   │
   ├─ Airtable configuré  →  création dans Demandes
   └─ mode démo           →  aucune écriture
   ▼
/confirmation
```

- Les lots sont triés par référence et filtrés par `?type=T2|T3|T4`.
- Le cache des lots est revalidé toutes les 60 secondes : la directrice change
  un statut dans Airtable, le site suit sans redéploiement.
- Les lots **Vendu** restent visibles, sans bouton de demande.
- Les lots **Optionné** restent visibles et acceptent une demande.
- Les prix et disponibilités sont indicatifs.

### Fichiers clés

| Fichier | Rôle |
| --- | --- |
| `app/page.tsx` | Page programme, liste des lots, filtres |
| `app/demande/page.tsx` | Page formulaire, résumé du lot sélectionné |
| `app/api/demandes/route.ts` | API POST : validation, anti-spam, écriture Airtable |
| `app/confirmation/page.tsx` | Confirmation, sans données personnelles dans l'URL |
| `app/confidentialite/page.tsx` | Politique de confidentialité |
| `app/mentions-legales/page.tsx` | Mentions légales |
| `lib/airtable.ts` | Accès Airtable, cache, mapping, écriture |
| `lib/validation.ts` | Validation serveur des champs |
| `lib/site.ts` | Configuration, consentement, informations légales |
| `lib/lots.ts` | Types, données de démonstration, formatage |
| `components/DemandeForm.tsx` | Formulaire client, erreurs, honeypot |
| `app/globals.css` | Design complet, responsive, reduced motion |
| `tests/airtable.test.mts` | Test mocké : mapping, pagination, payload, erreurs |

## Sécurité et RGPD

- Token Airtable uniquement dans les variables d'environnement serveur.
- Validation systématique côté serveur (jamais uniquement côté navigateur).
- Honeypot caché + limitation de débit par IP hachée en mémoire.
- Contrôle d'origine sur le POST et limite de taille du corps.
- Aucune donnée de formulaire dans les logs ; les erreurs Airtable ne
  journalisent que le statut HTTP.
- Consentement non pré-coché, version du texte et date enregistrées.
- Collecte minimale : téléphone, message et lot facultatifs.
- Conservation des prospects : 3 ans après le dernier contact.
- Aucun cookie, aucun traceur, aucune ressource tierce (polices système).
- En-têtes de sécurité dans `next.config.ts`.
- Les pages légales contiennent des champs à confirmer par le client
  (forme juridique, adresse, SIREN, directeur de publication, email).

## Intégration continue

Le workflow `.github/workflows/ci.yml` exécute à chaque push sur `main` et à
chaque pull request : installation, vérification TypeScript, test Airtable
mocké et build de production.

## Déploiement

1. Créer un dépôt GitHub et pousser le code :

   ```bash
   git init
   git add .
   git commit -m "Site Les Jardins de Vauban"
   git branch -M main
   git remote add origin https://github.com/<compte>/jardins-de-vauban.git
   git push -u origin main
   ```

2. Sur [vercel.com](https://vercel.com), importer le dépôt. Le framework est
   détecté automatiquement (Next.js).
3. Ajouter les variables d'environnement `AIRTABLE_TOKEN`,
   `AIRTABLE_BASE_ID`, `AIRTABLE_LOTS_TABLE`, `AIRTABLE_DEMANDES_TABLE`,
   `NEXT_PUBLIC_CONTACT_EMAIL` et, si besoin, `RATE_LIMIT_SALT`.
4. Déployer, puis renseigner `NEXT_PUBLIC_SITE_URL` avec l'URL Vercel finale
   et redéployer (les métadonnées et le sitemap en dépendent). Redéployer
   également après tout ajout ou changement de variable d'environnement.
5. Vérifier que le bandeau « Mode démonstration » a disparu : Airtable est
   bien connecté.

> Le plan Hobby de Vercel est gratuit mais ses conditions le réservent à un
> usage personnel / non commercial. Pour un site de promotion immobilière,
> vérifier les conditions ou prévoir un plan Pro. Techniquement, l'app tient
> largement sur l'offre gratuite.

> Ne pas committer `.env.local`. Le token Airtable ne doit pas apparaître dans
> l'historique Git. En cas de fuite, le révoquer immédiatement dans Airtable.

## Recette manuelle

- [ ] La page d'accueil affiche les lots, les compteurs par typologie et le
      prix minimum des lots disponibles.
- [ ] `/?type=T3` ne montre que des T3 ; le filtre actif est visible.
- [ ] Un lot vendu n'a pas de bouton ; un lot optionné en a un et affiche la
      mention d'option.
- [ ] « Ça m'intéresse » ouvre `/demande?lot=...` avec le lot pré-sélectionné.
- [ ] Un envoi valide mène à la confirmation et crée une ligne dans Demandes
      (si Airtable est configuré).
- [ ] Un envoi sans consentement ou avec un email invalide affiche les erreurs
      au bon endroit, sans perdre la saisie.
- [ ] Le champ piège rempli renvoie un faux succès, sans écriture.
- [ ] Les pages Mentions légales et Confidentialité sont accessibles depuis le
      pied de page et le formulaire.
- [ ] Le site est lisible sur mobile (390 px) et au clavier.
- [ ] Aucun cookie n'est déposé ; aucune requête vers un domaine tiers.
- [ ] Le token Airtable n'apparaît pas dans le bundle client
      (`grep -r "AIRTABLE_TOKEN" .next/static` ne doit rien renvoyer).
- [ ] Un changement de statut dans Airtable apparaît sur le site en moins de
      60 secondes.

## Limites connues

- Le rate limit est en mémoire, par instance Vercel : il freine le spam
  simple, mais ne remplace pas un captcha ou un WAF. Ajouter Cloudflare
  Turnstile si le formulaire est attaqué.
- Pas de back-office : la directrice travaille dans la vue Airtable
  « Commercial ».
- Pas de photos : les illustrations sont originales (SVG), donc sans question
  de droits. Des photos professionnelles pourront les remplacer.
- Les informations légales et l'email de contact sont des espaces à confirmer
  avant la mise en ligne réelle.
- La purge des prospects à 3 ans n'est pas automatisée : prévoir une
  automatisation Airtable ou une revue trimestrielle.
- Pas de tests end-to-end automatisés : la recette est manuelle (checklist
  ci-dessus). La couche Airtable est couverte par un test mocké (`npm test`).
- Pas de CSP : Next.js utilise des scripts inline ; une CSP à nonces est à
  ajouter si l'on veut durcir davantage les en-têtes.

## Documentation de conception

Les arbitrages, hypothèses, choix RGPD et le temps passé sont dans
[`DECISIONS.md`](DECISIONS.md).
#   K A L I M O - P R O M O T I O N  
 #   K A L I M O - P R O M O T I O N  
 