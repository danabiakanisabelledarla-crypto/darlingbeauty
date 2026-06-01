# 💅 Darling Beauty — Institut de Beauté

Application web fullstack de gestion d'un institut de beauté, développée dans le cadre du projet de fin de semestre — Licence 2 Développement Web (Django REST Framework + Angular 17).

**Étudiant :** [Votre nom]
**Enseignant :** M. KINKEU Daniel
**Année académique :** 2025–2026

---

## 🌐 Liens de déploiement

| Service | URL |
|---------|-----|
| 🔧 Backend API (Render) | `https://darling-beauty-api.onrender.com` |
| 🌸 Frontend (Vercel)    | `https://darling-beauty.vercel.app` |
| ⚙️ Admin Django         | `https://darling-beauty-api.onrender.com/admin/` |

---

## 🔑 Compte de démonstration

| Champ       | Valeur        |
|-------------|---------------|
| Utilisateur | `admin`       |
| Mot de passe| `Admin1234!`  |

> Créer ce compte via : `python manage.py createsuperuser`

---

## 📋 Fonctionnalités

### Backend Django REST Framework
- ✅ Authentification JWT (login / logout / register / refresh)
- ✅ Gestion des **Clients** (CRUD complet + filtrage par propriétaire)
- ✅ Gestion des **Services** et **Catégories** de beauté (CRUD)
- ✅ Gestion des **Rendez-vous** avec :
  - Détection automatique des conflits horaires
  - Filtrage par date et statut
  - Statistiques (aujourd'hui, ce mois, total)
  - Mise à jour du statut en temps réel
- ✅ Gestion des **Produits** avec alertes stock bas
- ✅ Interface d'administration Django personnalisée
- ✅ CORS configuré pour le frontend Angular
- ✅ Validation métier dans les sérialiseurs DRF

### Frontend Angular 17
- ✅ SPA avec routing et lazy loading
- ✅ JWT stocké en localStorage, HTTP Interceptor sur toutes les requêtes
- ✅ AuthGuard sur toutes les routes privées
- ✅ Services Angular dédiés pour chaque entité
- ✅ Reactive Forms avec validation côté client et affichage des erreurs serveur
- ✅ Indicateurs de chargement (spinner)
- ✅ Messages de succès et d'erreur
- ✅ Design responsive — thème rose & or "Darling Beauty"
- ✅ Tableau de bord avec statistiques en temps réel

---

## 🗂️ Structure du projet

```
darling-beauty/
├── backend/                    # Django REST Framework
│   ├── darling_beauty/         # Configuration principale
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── authentication/         # JWT auth (login/register/logout)
│   ├── clients/                # Gestion des clients
│   ├── services/               # Services et catégories
│   ├── appointments/           # Rendez-vous
│   ├── products/               # Produits & stock
│   ├── requirements.txt
│   ├── build.sh                # Script déploiement Render
│   └── manage.py
│
└── frontend/                   # Angular 17
    └── src/
        └── app/
            ├── core/
            │   ├── guards/         # AuthGuard
            │   ├── interceptors/   # JWT Interceptor
            │   ├── models/         # Interfaces TypeScript
            │   └── services/       # Services HTTP
            └── features/
                ├── auth/           # Login / Register
                ├── dashboard/      # Tableau de bord
                ├── clients/        # Gestion clients
                ├── services/       # Gestion services
                ├── appointments/   # Gestion rendez-vous
                └── products/       # Gestion produits
```

---

## 🚀 Installation locale

### Prérequis
- Python 3.11+
- Node.js 18+
- npm 9+

### Backend Django

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Créer un environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Créer le fichier .env
cp .env.example .env
# Modifier .env avec vos valeurs

# 5. Effectuer les migrations
python manage.py migrate

# 6. Créer un superutilisateur
python manage.py createsuperuser

# 7. Lancer le serveur
python manage.py runserver
```

Le backend sera accessible sur : `http://localhost:8000`
L'admin Django : `http://localhost:8000/admin/`

### Frontend Angular

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start
```

Le frontend sera accessible sur : `http://localhost:4200`

---

## 🌍 Déploiement en production

### Backend sur Render

1. Créer un compte sur [render.com](https://render.com)
2. New → **Web Service** → connecter votre dépôt GitHub
3. Paramètres :
   - **Build Command :** `./build.sh`
   - **Start Command :** `gunicorn darling_beauty.wsgi:application`
   - **Root Directory :** `backend`
4. Variables d'environnement à définir :
   ```
   SECRET_KEY=<votre-clé-secrète-longue>
   DEBUG=False
   ALLOWED_HOSTS=<votre-app>.onrender.com
   DATABASE_URL=<postgresql-url-fournie-par-render>
   CORS_ALLOWED_ORIGINS=https://<votre-app>.vercel.app
   ```
5. Ajouter une base de données **PostgreSQL** (New → PostgreSQL)

### Frontend sur Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. New Project → importer votre dépôt GitHub
3. Paramètres :
   - **Root Directory :** `frontend`
   - **Build Command :** `npm run build:prod`
   - **Output Directory :** `dist/darling-beauty`
4. Avant de déployer, mettre à jour `src/environments/environment.prod.ts` :
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://<votre-api>.onrender.com/api'
   };
   ```

---

## 📡 Endpoints API

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/login/` | Connexion (JWT) |
| POST | `/api/auth/register/` | Inscription |
| POST | `/api/auth/logout/` | Déconnexion |
| GET  | `/api/auth/me/` | Utilisateur connecté |
| GET/POST | `/api/clients/` | Liste / Créer clients |
| GET/PUT/DELETE | `/api/clients/{id}/` | Détail client |
| GET/POST | `/api/services/` | Liste / Créer services |
| GET/POST | `/api/services/categories/` | Catégories |
| GET/POST | `/api/appointments/` | Liste / Créer RDV |
| GET | `/api/appointments/aujourd_hui/` | RDV du jour |
| GET | `/api/appointments/statistiques/` | Statistiques |
| GET/POST | `/api/products/` | Liste / Créer produits |
| GET | `/api/products/stock_bas/` | Produits en stock bas |

---

## 🛠️ Technologies utilisées

**Backend :** Django 4.2 · Django REST Framework 3.15 · SimpleJWT · django-cors-headers · WhiteNoise · Gunicorn · PostgreSQL (prod) / SQLite (dev)

**Frontend :** Angular 17 · TypeScript · SCSS · Bootstrap Icons · RxJS

**Déploiement :** Render (backend) · Vercel (frontend) · GitHub (versioning)

---

*Institut Universitaire Saint Jean — Session Juin 2026*
