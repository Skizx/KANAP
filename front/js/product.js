//---------JE REDIRIGE L'URL DE L'API---------

// je crée une nouvelle url à partir de l'url actuelle 
// et en ajoutant searchParams pour manipuler les paramètres de requête d'URL :
let params = new URL(window.location.href).searchParams;
// j'indique que la nouvelle url sera ajoutée d'un id :
let newID = params.get('id');
// console.log(newID) vérification de l'id

//---------J'APPELLE DE NOUVEAU L'API AVEC L'ID DU CANAPE CHOISI---------

// je crée les variables dont j'ai besoin pour manipuler cette page :
const image = document.getElementsByClassName('item__img');
const title = document.getElementById('title');
const price = document.getElementById('price');
const description = document.getElementById('description');
const colors = document.getElementById('colors');

let imageURL = "";
let imageAlt = "";

// je crée la bonne URL pour chaque produit choisi en ajoutant newID
fetch("http://localhost:3000/api/products/" + newID)
  .then(res => res.json())
  .then(data => {
    // console.log(data) vérification contenu des informations du produit
    // je modifie le contenu de chaque variable avec les bonnes données :
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;

    // je configure le choix des couleurs 
    for (let i=0; i < data.colors.length; i++) {
      let color = document.createElement("option");
      color.setAttribute("value", data.colors[i]);
      color.innerHTML = data.colors[i];
      colors.appendChild(color);
    }
  })
    // j'ajoute un message au cas où le serveur ne répond pas
  .catch(_error => {
    alert('Oops ! Le serveur ne répond pas');
  });