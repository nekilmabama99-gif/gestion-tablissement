# Gestion Établissement — version Android (100% hors-ligne)

## Principe

Comme pour la version Windows/Mac/Linux (Electron), l'app Android embarque
directement `www/index.html` — aucune donnée n'est chargée depuis internet
au démarrage ni pendant l'usage. Une fois l'APK installé sur le téléphone
ou la tablette, plus aucune connexion n'est nécessaire, jamais.

**Il n'y a rien à faire sur Play Store** : cette app se distribue en
"sideload" — l'APK se copie et s'installe directement (clé USB, Bluetooth,
carte SD...), comme n'importe quel fichier.

## Option A — La plus simple : laisser GitHub compiler l'APK pour toi

1. Créer un dépôt GitHub (gratuit) et y pousser ce dossier
   (`capacitor-app/`).
2. Le fichier `.github/workflows/build-android.yml` inclus se déclenche
   automatiquement à chaque `git push` et compile l'APK sur les machines de
   GitHub — tu n'as besoin ni d'Android Studio ni du SDK Android sur ton
   propre ordinateur.
3. Une fois le build terminé (onglet "Actions" du dépôt), télécharger
   l'APK depuis les "Artifacts".

## Option B — Compiler toi-même, en local

Nécessite [Node.js](https://nodejs.org), un JDK 17, et le SDK Android
(le plus simple : installer [Android Studio](https://developer.android.com/studio),
qui installe tout automatiquement).

```
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

L'APK se trouve ensuite dans
`android/app/build/outputs/apk/debug/app-debug.apk`.

## Installer l'APK sur un téléphone/tablette (aucune connexion nécessaire)

1. Copier le fichier `.apk` sur l'appareil (clé USB/câble, carte SD...).
2. Sur l'appareil : Paramètres → Sécurité → autoriser
   "Installation d'apps provenant de sources inconnues" (le nom exact varie
   selon la version d'Android — l'appareil le proposera automatiquement au
   moment d'ouvrir le fichier `.apk`).
3. Ouvrir le fichier `.apk` depuis un gestionnaire de fichiers → Installer.

## Une remarque sur le stockage des données

L'app utilise `localStorage`, comme sur ordinateur — les données restent
sur l'appareil, propres à cette installation. Pense à utiliser la fonction
de sauvegarde/export déjà présente dans l'app (`exportBackup`) si tu veux
transférer les données d'un appareil à un autre, ou en garder une copie de
sécurité.

## Mettre à jour l'application plus tard

Remplace `www/index.html` par la nouvelle version, puis relance la
compilation (Option A ou B). Un utilisateur peut réinstaller le nouvel APK
par-dessus l'ancien sans perdre ses données, tant que le nom de package
(`appId` dans `capacitor.config.json`) ne change pas.

## Licence du logiciel

Cette version embarque le système de licence par clé publique/privée déjà
en place dans `index.html`. Utilise `generateur-licences.html` (fourni à
part, à garder chez toi) pour produire les clés de licence.
