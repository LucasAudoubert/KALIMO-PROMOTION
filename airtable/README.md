# Base Airtable — mode opératoire

Ce dossier contient le CSV de démonstration et le mode opératoire de la base.
Les noms de champs doivent être respectés **à l'identique** (accents compris) :
le code s'appuie sur ces noms.

## 1. Créer la base

1. Dans Airtable, créer une base vide nommée `Les Jardins de Vauban`.
2. Créer la table **Lots** (renommer la table par défaut).
3. Créer la table **Demandes**.

## 2. Table Lots

| Nom du champ | Type Airtable | Réglage |
| --- | --- | --- |
| `Référence` | Texte court | Champ principal |
| `Type` | Sélection unique | Options : `T2`, `T3`, `T4` |
| `Surface (m²)` | Nombre | Format décimal, 0 décimale |
| `Étage` | Nombre | Entier (0 = rez-de-jardin) |
| `Prix (€)` | Devise | EUR, 0 décimale |
| `Statut` | Sélection unique | Options : `Disponible`, `Optionné`, `Vendu` |
| `Demandes` | Lien vers une autre table | Vers `Demandes` (créé avec le lien) |
| `Nb demandes` | Comptage | Compte les enregistrements liés de `Demandes` |

> Le champ inverse `Demandes` est créé automatiquement par Airtable lorsqu'on
> ajoute le champ de lien dans la table Demandes. Il peut être renommé
> `Demandes` dans la table Lots.
>
> Le champ `Nb demandes` est un bonus pour l'équipe : il n'est pas affiché sur
> le site public.

## 3. Table Demandes

| Nom du champ | Type Airtable | Réglage |
| --- | --- | --- |
| `ID` | Numéro automatique | Champ principal |
| `Nom` | Texte court | — |
| `Email` | Email | — |
| `Téléphone` | Texte court | Champ facultatif |
| `Message` | Texte long | — |
| `Lot concerné` | Lien vers une autre table | Vers `Lots`, autoriser un seul enregistrement |
| `Consentement` | Case à cocher | — |
| `Version du texte de consentement` | Texte court | — |
| `Reçue le` | Date de création | Inclure l'heure |
| `Traitement` | Sélection unique | `Nouveau`, `Contacté`, `Clos` |

Le code impose `Consentement = true`, `Traitement = Nouveau` et la version du
texte de consentement. Il n'écrit jamais dans `Lots`.

## 4. Importer les lots de démonstration

1. Ouvrir la table **Lots**.
2. Menu de la table → *Import data* → *CSV file*.
3. Importer `airtable/lots.csv`.
4. Vérifier que les colonnes sont bien associées :
   - `Référence` → `Référence`
   - `Type` → `Type`
   - `Surface (m²)` → `Surface (m²)`
   - `Étage` → `Étage`
   - `Prix (€)` → `Prix (€)`
   - `Statut` → `Statut`
5. Laisser Airtable créer les options `Disponible`, `Optionné`, `Vendu` si
   nécessaire.

## 5. Vue « Commercial » pour la directrice

Dans la table Lots :

- Créer une vue grille nommée `Commercial`.
- Conserver uniquement les champs : `Référence`, `Type`, `Surface (m²)`,
  `Étage`, `Prix (€)`, `Statut`, `Nb demandes`.
- Grouper par `Statut`.
- Figer la colonne `Référence`.
- Masquer les champs techniques si besoin.

La directrice peut modifier `Statut` directement dans cette vue. Le site
revalide les données toutes les 60 secondes : aucun redéploiement nécessaire.

## 6. Automatisation email

Dans Airtable : *Automations* → nouveau déclencheur
« When record created » sur `Demandes`.

- Action : *Send email*.
- Destinataire : l'équipe commerciale Kalimo.
- Objet : `Nouvelle demande — Les Jardins de Vauban`.
- Corps : `Nom`, `Email`, `Téléphone`, `Message`, `Lot concerné`, `Reçue le`.

L'email reste interne : ne pas ajouter d'adresse externe au automate. Ne pas
mettre de données personnelles dans des outils de test.

## 7. Token Airtable

1. Airtable → *Developer hub* → *Personal access tokens* → *Create token*.
2. Nom : `Site Jardins de Vauban`.
3. Scopes :
   - `data.records:read`
   - `data.records:write`
4. Accès : **une seule base**, `Les Jardins de Vauban`.
5. Copier le token dans `AIRTABLE_TOKEN` (localement dans `.env.local`,
   sur Vercel dans les variables d'environnement).
6. Récupérer l'ID de la base dans l'URL Airtable (`appXXXXXXXXXXXXXX`) et le
   mettre dans `AIRTABLE_BASE_ID`.

Le token ne doit jamais être préfixé par `NEXT_PUBLIC_`, ni commité, ni
communiqué par email. En cas de fuite : révoquer le token et en créer un autre.
