# LUMI – Apprends à ta façon. Avance à ton rythme.

> Application éducative complète pour enfants de 8–12 ans avec TDAH, dyslexie et dyscalculie.  
> Parcours guidé en 13 séances + 3 bilans + projet final — Next.js 14 · Supabase · Vercel

---

## 🚀 Déploiement rapide

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

Créez un projet sur [supabase.com](https://supabase.com), puis exécutez dans l'éditeur SQL :

```
supabase/schema.sql    ← Tables
supabase/rls.sql       ← Sécurité par rôle
supabase/triggers.sql  ← Automatisation
supabase/seed.sql      ← Contenu pédagogique
```

### 3. Variables d'environnement

Copiez `.env.local.example` → `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon
SUPABASE_SERVICE_ROLE_KEY=votre-clé-service
```

### 4. Comptes de test

Créez dans Supabase → Authentication → Users :

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| `eleve@lumi.app` | `Lumi2024!` | student |
| `parent@lumi.app` | `Lumi2024!` | parent |
| `annelisecaillet05@gmail.com` | `Lumi2024!` | teacher |
| `admin@lumi.app` | `Lumi2024!` | admin |

Utilisez l'espace Admin (`/admin → Liens`) pour lier parent ↔ élève et prof ↔ élève.

### 5. Lancer

```bash
npm run dev        # http://localhost:3000
```

### 6. Déployer sur Vercel

```bash
vercel --prod
```

Ajoutez les 3 variables d'environnement dans Vercel → Settings → Environment Variables.

---

## 🗂️ Structure

```
src/app/eleve/          Dashboard élève, parcours, séances, projet
src/app/parent/         Tableau de bord parent
src/app/professeur/     Suivi élèves, notes pédagogiques
src/app/admin/          Gestion utilisateurs et liens
src/components/activities/  Quiz, Typing, DragDrop, Flashcard, Emotion…
src/components/layout/  StudentLayout, AppLayout, RoleGuard
supabase/               schema.sql, rls.sql, triggers.sql, seed.sql
```

---

## 🎓 Parcours pédagogique

**Bloc 1** – Ordinateur & Productivité (Séances 0–4 + Bilan 1)  
**Bloc 2** – IA & Esprit critique (Séances 5–8 + Bilan 2)  
**Bloc 3** – Logique & Autonomie (Séances 9–12 + Bilan 3)  
**Projet final** – Mon assistant d'aide aux devoirs (4 étapes guidées)

---

## ♿ Accessibilité

Mode dyslexie · Grands boutons · Feedback positif · Sans timer agressif · Contraste doux

---

## Présentation du projet

**LUMI** est une application éducative pensée pour accompagner un enfant de 10 ans dans un programme intensif couvrant :

- L'utilisation avancée de l'ordinateur
- La productivité scolaire
- L'intelligence artificielle (multi-types, comparaison)
- La logique et le code
- L'esprit critique
- La frappe clavier
- La recherche d'information

LUMI n'est pas un cours en ligne classique. C'est un **outil de progression et de performance** adapté aux profils neuro-atypiques (TDAH, dyslexie, dyscalculie), fondé sur des sessions courtes, des interfaces visuelles et un feedback immédiat.

---

## Concept produit

| Élément | Détail |
|---|---|
| **Nom** | LUMI |
| **Tagline** | Apprends à ta façon. Avance à ton rythme. |
| **Cible principale** | Enfants 8–12 ans, profils dys / TDAH |
| **Promesse** | Transformer les difficultés en forces grâce au numérique |
| **Différenciation** | Sessions ultra-courtes + visuels dominants + IA comparative + 3 espaces distincts |

---

## Objectifs

- Apprendre à utiliser efficacement un ordinateur
- Gagner du temps dans le travail scolaire
- Compenser les difficultés (TDAH, dyslexie, dyscalculie)
- Développer la logique et l'esprit critique
- Apprendre à utiliser et comparer différents types d'IA
- Rendre l'enfant autonome et confiant

---

## Les 3 espaces de l'application

### 🧑‍🎓 Espace Élève
Interface gamifiée, visuelle, parcours en missions. L'enfant apprend en faisant.

### 👨‍👩‍👧 Espace Parent
Suivi de progression simplifié, temps passé, compétences acquises, conseils d'accompagnement.

### 👩‍🏫 Espace Professeur
Vue complète du parcours, indicateurs détaillés, personnalisation des séances, gestion des bilans.

---

## Fonctionnalités clés

### Espace Élève
- Interface visuelle, peu de texte, icônes parlantes
- Parcours structuré en 13 séances + 3 bilans + 1 projet final
- Blocs d'activité de 5 à 10 minutes maximum
- Exercices interactifs avec feedback immédiat
- Système de badges et points d'expérience (XP)
- Galerie des créations personnelles
- Suivi visuel de progression (carte du parcours)
- Accès au projet personnel (outil d'aide aux devoirs)

### Espace Parent
- Tableau de bord synthétique hebdomadaire
- Courbe de progression par compétence
- Temps passé par module
- Points forts et difficultés identifiés
- Conseils simples d'accompagnement à la maison
- Accès aux rapports de bilans (séances 4, 8, 12)

### Espace Professeur
- Vue séance par séance avec métriques détaillées
- Indicateurs : concentration, vitesse de frappe, taux de réussite, logique
- Notes pédagogiques par séance
- Ajustement du contenu et du rythme
- Création de séances personnalisées
- Gestion et rédaction des bilans
- Suivi du projet final de l'élève

---

## Structure pédagogique

```
Séance 0   — Diagnostic initial
Séances 1–4  — Bloc 1 : Ordinateur + Productivité
Bilan 1    — Évaluation et ajustement
Séances 5–8  — Bloc 2 : IA + Esprit critique
Bilan 2    — Évaluation et ajustement
Séances 9–12 — Bloc 3 : Logique + Création + Autonomie
Bilan 3    — Évaluation finale
Projet     — Construction de l'outil d'aide aux devoirs
```

---

## Les 12 modules

| # | Module | Durée typique |
|---|---|---|
| 1 | Optimisation ordinateur | 2 séances |
| 2 | Productivité scolaire | 2 séances |
| 3 | Structuration des idées | 1 séance |
| 4 | Intelligence artificielle | 2 séances |
| 5 | Comparaison d'IA | 1 séance (obligatoire) |
| 6 | Esprit critique | 1 séance |
| 7 | Logique et code | 2 séances |
| 8 | Frappe clavier | Fil rouge (toutes séances) |
| 9 | Recherche d'information | 1 séance |
| 10 | Révision intelligente | 1 séance |
| 11 | Création de contenus | 1 séance |
| 12 | Projet final | 4 séances progressives |

---

### Phase 1 — MVP (2 mois)
- [ ] Authentification 3 rôles (élève / parent / prof)
- [ ] Espace élève : parcours linéaire, 13 séances
- [ ] Module frappe clavier (fil rouge)
- [ ] Module comparaison d'IA
- [ ] Système de badges basique
- [ ] Espace parent : tableau de bord simple
- [ ] Espace prof : vue parcours + notes

### Phase 2 — Enrichissement (2 mois)
- [ ] Module esprit critique interactif
- [ ] Module projet final (outil d'aide aux devoirs)
- [ ] Bilans automatiques avec rapport PDF
- [ ] Système XP et niveaux
- [ ] Notifications parent (hebdomadaires)
- [ ] Mode dyslexie (police adaptée, espacement)

### Phase 3 — Personnalisation (2 mois)
- [ ] Ajustement dynamique du rythme selon progression
- [ ] Recommandations IA pour le professeur
- [ ] Mode hors-ligne (PWA)
- [ ] Multi-élèves pour le professeur
- [ ] Export des créations de l'élève

---

## Vision long terme

LUMI vise à devenir la référence des outils d'accompagnement numérique pour les enfants neuro-atypiques. Les axes d'évolution incluent :

- **Adaptabilité totale** : parcours généré automatiquement selon le profil de l'élève
- **IA pédagogique intégrée** : suggestions de révision, détection des blocages
- **Communauté** : partage de créations entre élèves (espace sécurisé)
- **Certifications** : badges reconnus par les établissements scolaires partenaires
- **Multilingue** : extension à d'autres langues

---

## Principes de conception

### Adaptation TDAH / Dys
- Sessions découpées en blocs de 5 à 10 minutes maximum
- Interface visuelle dominant le texte
- Police adaptée à la dyslexie (OpenDyslexic disponible)
- Feedback immédiat après chaque action
- Répétition intelligente des notions difficiles
- Pas de minuterie stressante — l'enfant avance à son rythme

### Gamification respectueuse
- Points d'expérience (XP) pour chaque activité complétée
- Badges thématiques déblocables
- Carte du parcours visuelle (carte d'aventure)
- Défis optionnels courts
- Aucune pénalité pour l'échec — uniquement des encouragements

---

*LUMI — Parce que chaque enfant mérite un outil à sa mesure.*
