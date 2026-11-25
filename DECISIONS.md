# DECISIONS — Les Jardins de Vauban

Site de prospects pour un programme unique : 12 lots, demande qualifiée,
statuts gérés dans Airtable, RGPD dès la V1.

## Décisions

| Sujet        | Choix                                                                                                         | Raison                                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Architecture | Next.js monolithique sur Vercel                                                                               | Un dépôt, un déploiement ; token Airtable côté serveur.                                                                                                |
| Données      | Airtable source de vérité, sans SQL ni table `Programmes`                                                     | 12 lots, un programme ; la directrice édite sans développeur. Lecture `Lots`, écriture `Demandes` uniquement, noms de champs exacts (accents compris). |
| Fraîcheur    | Cache 60 s, sans webhook                                                                                      | Une minute de latence suffit.                                                                                                                          |
| Lots         | Filtre `?type=T3` SSR ; Disponible/Optionné demandables, Vendu visible sans bouton                            | URL partageable ; une option peut se libérer.                                                                                                          |
| Formulaire   | Page dédiée, validation serveur, honeypot, rate limit                                                         | Accessibilité, lien direct, aucun secret client.                                                                                                       |
| RGPD         | Consentement versionné (`2026-11-25`), `Traitement=Nouveau` forcé, zéro PII dans les logs, aucun cookie/tiers | Collecte minimale et preuve du consentement.                                                                                                           |
| Résilience   | Mode démo sans Airtable ; erreur générique en cas de panne                                                    | Site démontrable, pas de fuite technique.                                                                                                              |

## Limites

- 12 lots fictifs, prix indicatifs, mentions légales à confirmer.
- Conservation 3 ans non automatisée ; Airtable/Vercel hors UE ; Vercel Hobby non commercial ; limites Airtable gratuit.
- Rate limit en mémoire, pas de CSP ni d'E2E ; captcha si spam.
- Hors périmètre : back-office, comptes, paiement, emails custom, photos, analytics, multilingue.

## IA

Binôme d'implémentation, pas décideur : cadrage écrit, prompts contraints
(token serveur, zéro cookie, validation serveur, pas de PII), relecture humaine
et vérification par l'exécution (`tsc`, `next build`, test mocké, tests HTTP).
Prix, disponibilités, mentions légales et publication restent humains.

## Temps

~2 h 40 estimé ; réel à compléter.

## Suite

Mentions légales, vrais lots, token restreint, vue Commercial + email, purge à 3 ans, photos, E2E.

## Outils

J'ai planifier mes tâches grâce à mon set de skills combiné à Sonnet 5.5.
Pour les tâches techniques (Code & Architecture) j'ai utilisé mes skills + Deepseek V4.1 Flash 1017 pour une optimiser mon rapport qualité/temps.
Agents/Subagent combiné à mon set complet de skills.
