# Yishi's Shop

Site vitrine statique pour une boutique Discord.

## Fichiers

- `index.html` : structure du site
- `styles.css` : design responsive
- `script.js` : menu mobile et lien Discord
- `assets/hero-yishis-shop.png` : image principale du site
- `assets/kitsune-galaxy.webp` : image du produit Kitsune Galaxy
- `assets/kitsune-crimson.png.webp` : image du produit Kitsune Crimson
- `assets/ember-dragon.png.png` : image du produit Ember Dragon
- `assets/divine-portal.webp` : image du produit Divin Portal

## Modifier le lien Discord

Dans `script.js`, remplace :

```js
const discordInviteUrl = "https://discord.gg/ton-lien";
```

par le vrai lien d'invitation de ton serveur.

## Publier avec GitHub Pages

1. Envoie ces fichiers dans ton repository GitHub.
2. Va dans `Settings` puis `Pages`.
3. Dans `Build and deployment`, choisis `Deploy from a branch`.
4. Selectionne la branche `main` et le dossier `/root`.
5. Clique sur `Save`.

GitHub donnera ensuite une URL publique pour le site.
