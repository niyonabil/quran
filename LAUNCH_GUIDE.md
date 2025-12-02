# 🚀 Démarrage des Applications

## Serveurs à Lancer

### 1. Backend API
```bash
cd backend
npm run start:dev
```
**URL**: http://localhost:3000

### 2. Application Web
```bash
cd web
npm run dev
```
**URL**: http://localhost:5173

### 3. Panneau Admin
```bash
cd admin
npm run dev
```
**URL**: http://localhost:5174

## URLs à Ouvrir dans le Navigateur

1. **Backend API**: http://localhost:3000/api
2. **Web App**: http://localhost:5173
3. **Admin Panel**: http://localhost:5174/login

## Compte Admin pour Tests

Créez d'abord un compte via l'API ou l'app web, puis modifiez le role en 'admin' directement dans Supabase pour accéder au panneau admin.

## Toutes les Fonctionnalités

### Web App (Port 5173)
- ✅ Accueil avec horaires de prière
- ✅ Login/Register
- ✅ Lecteur Coran (liste + détails)
- ✅ Recherche de versets
- ✅ Horaires de prière
- ✅ Profil utilisateur
- ✅ Favoris

### Admin Panel (Port 5174)
- ✅ Login admin
- ✅ Dashboard avec statistiques
- ✅ Liste des utilisateurs
- ✅ Suppression d'utilisateurs

### Backend (Port 3000)
- ✅ API Auth (`/api/auth/*`)
- ✅ API Quran (`/api/quran/*`)
- ✅ API Prayer (`/api/prayer/*`)
- ✅ API User (`/api/user/*`)
- ✅ API Admin (`/api/admin/*`)

---

**Status**: Tous les serveurs démarrés ✅
