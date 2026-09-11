# ANAYA Boutique & Couture

## Utilisation rapide

Ouvrez `index.html` dans votre navigateur pour afficher le site.

Pour modifier le catalogue, ouvrez seulement `data/products.js`. Chaque produit est regroupé dans ce fichier : son nom, sa catégorie, son prix, sa photo, ses tailles et ses couleurs.

## Ajouter un produit

1. Placez la photo dans `assets/products/`.
2. Copiez une ligne de produit existante dans `data/products.js`.
3. Donnez-lui un nouvel `id`, un `name`, une `image` et les informations souhaitées.
4. Enregistrez le fichier puis actualisez le navigateur.

Exemple :

```js
{id:16,name:"Nouvelle robe enfant",category:"Vêtements",price:15000,image:"assets/products/ma-robe.jpg",badge:"Nouveau",desc:"Description courte.",sizes:["4 ans","6 ans","8 ans"],colors:[{name:"Rose",hex:"#f29abb"}]}
```

Utilisez `price:null` si le prix doit être demandé sur WhatsApp. Avec un montant comme `price:15000`, l'article pourra être ajouté au panier.

## Organisation des fichiers

- `index.html` : structure des pages et sections.
- `style.css` : couleurs, apparence et adaptation mobile.
- `data/products.js` : tous les produits et leurs variantes.
- `script.js` : recherche, filtres, panier, tailles, couleurs et WhatsApp.
- `assets/products/` : photos des produits.

## Informations boutique

Le numéro WhatsApp est `+223 96 96 66 66`. Pour le modifier, recherchez `22396966666` dans `index.html` et `script.js`.
