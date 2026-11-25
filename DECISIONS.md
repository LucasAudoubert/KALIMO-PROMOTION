# DECISIONS — Les Jardins de Vauban

Document de conception et de passation. Il explique ce qui a été fait, ce qui a
été volontairement laissé de côté, les hypothèses prises et la manière dont
l'IA a été utilisée.

## 1. Objectif

Livrer un site crédible pour la commercialisation des
Jardins de Vauban :

- présenter les lots et leurs disponibilités ;
- permettre une demande qualifiée en quelques champs ;
- laisser la directrice mettre à jour les statuts sans développeur ;
- respecter les principes RGPD dès la première version ;
- rester simple à relire, à déployer et à défendre à l'oral.

## 2. Ce qui est livré

- Page programme avec héros, présentation, démarche et appel à l'action.
- Liste des 12 lots fictifs, filtrable par typologie via l'URL (`?type=T3`).
- Badges de statut : Disponible, Optionné, Vendu.
- Bouton « Ça m'intéresse » qui pré-remplit le lot dans le formulaire.
- Formulaire avec validation serveur, honeypot et limitation de débit.
- Écriture dans la table Airtable `Demandes` uniquement.
- Page de confirmation sans donnée personnelle dans l'URL.
- Pages Mentions légales et Politique de confidentialité.
- Consentement non pré-coché, versionné et horodaté par Airtable.
- Mode démonstration automatique si Airtable n'est pas configuré.
- `README.md`, `DECISIONS.md`, CSV d'import et mode opératoire Airtable.
- Test mocké de la couche Airtable (`npm test`), sans token ni réseau.

## 3. Décisions structurantes

### Next.js monolithique plutôt qu'un front + un back séparés

Un seul dépôt, un seul déploiement Vercel, une seule base de code. Les routes
API vivent dans le même projet que les pages. C'est le meilleur rapport
simplicité / sécurité pour un site de cette taille : le token Airtable ne
transite jamais par le navigateur.

### Airtable comme source de vérité, sans base de données supplémentaire

La directrice connaît déjà Airtable (ou l'apprend en quelques minutes). La vue
« Commercial » lui donne un tableau éditable, et l'automatisation email lui
évite d'ouvrir un outil de développeur. Ajouter une base SQL aurait doublé le
travail de synchronisation sans bénéfice pour 12 lots.

### Pas de table Programmes

Il n'y a qu'un programme. Une table dédiée aurait ajouté une jointure et un
écran d'administration pour une donnée qui tient dans `lib/site.ts`. Si Kalimo
ouvre un second programme, la table deviendra pertinente.

### Cache de 60 secondes plutôt qu'un webhook Airtable

Un `fetch` avec `next: { revalidate: 60 }` suffit : la directrice change un
statut, le site suit en moins d'une minute, sans redéploiement ni webhook à
sécuriser. Pour un programme immobilier, une minute de latence est acceptable.
Si le besoin devient temps réel, un webhook Airtable + `revalidateTag("lots")`
sera la suite logique.

### Filtre par URL plutôt que filtre JavaScript

`/?type=T3` est partageable, indexable, fonctionne sans JavaScript et se rend
côté serveur. Les liens de filtre conservent le compteur de lots et l'ancre
`#lots`.

### Formulaire sur une page dédiée

Plutôt qu'une modale : meilleure accessibilité, URL partageable
(`/demande?lot=A-103`), retour navigateur naturel, et possibilité de mettre le
résumé du lot à côté du formulaire. Le bouton de chaque carte pointe vers cette
page avec la référence du lot.

### Statuts : vendu sans bouton, optionné avec bouton

- **Disponible** : visible, demande possible.
- **Optionné** : visible, demande possible, mention « une option est en cours ».
  Une option peut se libérer ; refuser la demande ferait perdre un prospect.
- **Vendu** : visible pour la transparence du programme, sans bouton.

### Consentement versionné et traitement imposé

Le texte de consentement porte une version (`2026-11-25`). Chaque demande
enregistre cette version, la case cochée et la date de création Airtable. Le
statut `Traitement` est forcé à `Nouveau` côté serveur : un visiteur ne peut pas
écrire dans le pipeline commercial.

### Mode démonstration explicite

Sans variables Airtable, le site affiche un bandeau « Mode démonstration —
données fictives, les demandes ne sont pas enregistrées ». C'est volontaire :
mieux vaut un site démontrable immédiatement qu'un écran d'erreur, à condition
que l'utilisateur ne croie pas avoir envoyé une vraie demande. Le bandeau
disparaît dès que le token et l'ID de base sont renseignés.

### Illustrations SVG originales, pas de photos

Le brief autorise des visuels libres de droits. Plutôt que d'aller chercher une
photo dont la licence ou l'usage commercial serait à vérifier, deux
illustrations originales (façade et plan de jardin) ont été dessinées en SVG.
Elles sont légères, nettes sur tous les écrans, sans question de droits, et
cohérentes avec la palette. Des photos professionnelles pourront les remplacer
quand elles seront disponibles.

### Aucune ressource tierce, aucun cookie

Pas de Google Fonts, pas d'analytics, pas de carte, pas de widget. Les polices
sont celles du système. Cela supprime le bandeau cookies, les transferts d'IP
vers des tiers non nécessaires et un point de panne. C'est aussi un argument
simple à défendre : le site ne dépose rien et ne charge rien depuis un autre
domaine.

### Dégradation propre en cas de panne Airtable

Si la lecture des lots échoue, la page n'affiche pas une erreur technique : elle
propose d'écrire à l'équipe. Si l'écriture échoue, le formulaire affiche un
message générique et invite à réessayer. Aucun détail Airtable n'est exposé.

## 4. Hypothèses

- **12 lots fictifs**, comme le brief l'autorise, et non 48.
- **Prix et surfaces indicatifs** : aucune donnée commerciale réelle n'a été
  fournie. Les montants sont cohérents entre typologies mais ne valent pas
  engagement.
- **Pas d'adresse, de ville, de date de livraison ni de prestations inventées.**
  Les textes restent volontairement sobres pour éviter les fausses allégations.
- **Les lots Optionné restent demandables** ; les Vendu restent visibles.
- **Durée de conservation : 3 ans** après le dernier contact, en référence aux
  recommandations CNIL pour la gestion des prospects.
- **Airtable et Vercel sont des sous-traitants hors UE.** Les transferts doivent
  être couverts par leurs accords de sous-traitance et les clauses contractuelles
  types / le Data Privacy Framework. À signaler et à documenter avec le client.
- **Le plan Hobby de Vercel est réservé à un usage non commercial.** Il suffit
  techniquement, mais un site de promotion immobilière doit vérifier les
  conditions ou prévoir un plan Pro.
- **Le plan gratuit Airtable a des limites** (1 000 enregistrements par base,
  éditeurs et automatisations restreints). Suffisant pour le lancement, à
  surveiller si le volume de demandes augmente.
- **L'email de contact et les informations légales sont des hypothèses** :
  `contact@kalimo.fr`, forme juridique, adresse, SIREN et directeur de
  publication sont à confirmer avant mise en ligne. Ils sont centralisés dans
  `lib/site.ts` pour être modifiés en un seul endroit.
- **La version du consentement** est datée du 25 novembre 2026 ; toute
  modification du texte doit incrémenter cette version.

## 5. RGPD et sécurité

### Mesures mises en place

| Risque | Mesure |
| --- | --- |
| Token exposé au navigateur | Token uniquement dans une variable serveur, sans préfixe `NEXT_PUBLIC_` |
| Écriture non autorisée | Le code n'écrit que dans `Demandes` ; token limité à cette base |
| Spam | Honeypot caché + limitation de débit + contrôle d'origine |
| Injection / XSS | React échappe les sorties ; validation stricte des champs |
| Données dans les logs | Aucun contenu de formulaire journalisé ; statut HTTP seul |
| Consentement ambigu | Case non pré-cochée, texte versionné, version stockée |
| Collecte excessive | Téléphone, message et lot facultatifs ; pas de données sensibles |
| Conservation indéfinie | Durée de 3 ans documentée ; suppression à prévoir côté Airtable |
| Traceurs | Aucun cookie, aucun analytics, aucune ressource tierce |
| Transport | HTTPS par Vercel ; en-têtes `nosniff`, `DENY`, `Referrer-Policy` |

### Limites assumées

- Le rate limit est en mémoire, par instance Vercel. Il ne bloque pas une
  attaque distribuée. Un captcha (Cloudflare Turnstile) ou un WAF est la suite
  si le formulaire est ciblé.
- L'email n'est pas vérifié par double opt-in. Le consentement est explicite,
  mais une adresse erronée reste possible. À ajouter si le volume de prospects
  le justifie.
- Les logs de la plateforme Vercel peuvent contenir des métadonnées de requête
  (IP, user-agent) ; l'application, elle, ne journalise aucune donnée de
  formulaire. Cette distinction est à expliquer au client.
- Le hachage d'IP pour le rate limit est éphémère (mémoire, 10 minutes) mais
  reste un traitement de données : il est documenté ici et minimisé.
- La suppression à 3 ans n'est pas automatisée : elle doit être planifiée dans
  Airtable (automatisation ou revue trimestrielle). La politique de
  confidentialité l'annonce, l'outil doit suivre.
- Aucune CSP n'est configurée pour ne pas casser les scripts inline de Next.js.
  Une CSP à nonces est la prochaine amélioration de sécurité.
- Les informations légales doivent être complétées et validées par le client
  avant toute mise en ligne réelle.

## 6. Ce qui est volontairement hors périmètre

| Élément | Raison |
| --- | --- |
| Back-office maison | Airtable + vue Commercial suffisent, aucun développement |
| Table Programmes | Un seul programme |
| Compte utilisateur / espace acquéreur | Aucun besoin exprimé, surface inutile |
| Paiement / réservation en ligne | Hors sujet pour une prise de contact |
| Emails transactionnels custom | Automatisation Airtable, pas de serveur mail à gérer |
| Photos et plans de masse | Données non fournies ; illustrations originales en attendant |
| Analytics | Pas de besoin, et évite un bandeau cookies |
| Captcha | Honeypot + rate limit suffisent pour le lancement |
| Tests end-to-end | Temps contraint ; recette manuelle documentée. La couche Airtable est couverte par un test mocké (`npm test`) |
| Multilingue | Programme local, public francophone |
| Compteur public de demandes | Le bonus est couvert dans Airtable, pas sur le site public |

## 7. Pilotage de l'IA

L'IA a été utilisée comme **binôme d'implémentation**, pas comme décideur.
La démarche :

1. **Cadrage écrit avant de coder** : stack, schéma Airtable, parcours,
   contraintes RGPD, deadline. Le plan a servi de contrat pour éviter les
   ajouts inutiles.
2. **Découpage en briques livrables** : squelette déployable, puis liste et
   filtres, puis formulaire et RGPD, puis documentation. Chaque brique a été
   vérifiée avant de passer à la suivante.
3. **Prompts contraints** : « token uniquement côté serveur », « pas de cookie »,
   « validation serveur », « aucune donnée personnelle dans les logs »,
   « mobile d'abord ». Les contraintes ont été répétées à chaque étape.
4. **Relecture humaine** : chaque fichier a été relu, les dépendances refusées
   quand elles n'étaient pas nécessaires, les noms de champs Airtable vérifiés
   à l'identique, les textes légaux relus.
5. **Vérification par l'exécution** : `tsc --noEmit`, `next build`, test mocké
   de la couche Airtable, tests HTTP des cas valides et invalides, filtre
   `?type=T3`, parcours navigateur complet, captures desktop et mobile,
   contrôle des en-têtes, des cookies et du bundle client.
6. **Ce qui n'a pas été délégué** : les prix, les disponibilités, les
   coordonnées légales et la décision de publier. L'IA propose, le client
   valide.

Ce que l'IA a apporté : le squelette, la cohérence du design, les tests de
bord, la documentation. Ce qu'elle ne peut pas apporter : la réalité
commerciale du programme et la validation juridique.

## 8. Temps passé

À remplir au fil de l'eau, sans reconstituer après coup. Les estimations sont
celles du plan initial.

| Phase | Estimé | Réel |
| --- | --- | --- |
| Préparation (token, base, dépôt) | 10 min | |
| Base Airtable + import des lots | 20 min | |
| Squelette + premier déploiement | 20 min | |
| Liste des lots + filtres | 30 min | |
| Formulaire + RGPD | 45 min | |
| Statuts + automatisation | 10 min | |
| Bonus éventuel | 15 min | |
| `DECISIONS.md` | 10 min | |
| **Total** | **~2 h 40** | |

## 9. Livrables et suite

Livrables attendus :

- URL Vercel ;
- dépôt GitHub ;
- accès en lecture à la base Airtable (ou capture de structure) ;
- ce document ;
- le README de déploiement et le CSV d'import.

Prochaines étapes, par ordre de valeur :

1. Renseigner les vraies informations légales et l'email de contact.
2. Importer les lots réels, vérifier prix, surfaces et statuts.
3. Créer le token Airtable restreint et le mettre dans Vercel.
4. Configurer la vue « Commercial » et l'automatisation email.
5. Tester le parcours complet sur mobile et vérifier la réception des emails.
6. Programmer la purge des données à 3 ans (automatisation Airtable ou revue
   trimestrielle).
7. Ajouter des photos professionnelles quand elles seront disponibles.
8. Si le spam devient un problème : Turnstile, puis journalisation des
   tentatives (sans données personnelles).
9. Si un second programme est lancé : extraire une table `Programmes` et
   paramétrer les pages par programme.
