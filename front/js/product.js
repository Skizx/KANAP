//---------JE REDIRIGE L'URL DE L'API---------

// je crée une nouvelle url à partir de l'url actuelle 
let params = new URL(window.location.href).searchParams;
let newID = params.get('id');
console.log(newID) // vérification de l'id

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
    //console.log(data) // vérification contenu des informations du produit
    image[0].innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
    imageURL = data.imageUrl;
    imageAlt = data.altTxt;
    title.innerHTML = `<h1>${data.name}</h1>`;
    price.innerText = `${data.price}`;
    description.innerText = `${data.description}`;

    // je configure le choix des couleurs 
    for (let i=0; i < data.colors.length; i++) {
      let color = document.createElement("option");
      //je modifie la valeur avec les données des couleurs
      color.setAttribute("value", data.colors[i]);
      //je modifie le contenu HTML en lui donnant les données des couleurs
      color.innerHTML = data.colors[i];
      //je deplace le contenu précédent a l'emplacement de ma variable colors
      colors.appendChild(color);
    }
  })
  // j'ajoute un message au cas où le serveur ne répond pas
  .catch(_error => {
    alert('Oops ! Le serveur ne répond pas');
  });
  
  const selectQuantity = document.getElementById('quantity');
  const selectColors = document.getElementById('colors');
  

  
  // je configure un eventListener quand l'utilisateur clique sur ajouter au panier
  const addToCart = document.getElementById('addToCart');
  addToCart.addEventListener('click', (event) => {
    event.preventDefault();
    const selection = {
      id: newID,
      image: imageURL,
      alt: imageAlt,
      name: title.textContent,
      //price: price.textContent,
      color: selectColors.value,
      quantity: selectQuantity.value,
    };
    
    // si l'utilisateur ne choisis pas de couleur ni de quantité je lui retourne une alerte
    if (selectColors.value <= null || selectQuantity.value <= null || selectColors.value <= 0 || selectQuantity.value <= 0) {
      return alert('Veuillez choisir une couleur et selectionner un nombre.')
    }
    
    // je déclare une variable productInLocalStorage 
    // dans laquelle je mets les clés+valeurs dans le localStorage
    // JSON.parse permet de convertir les données au format JSON en objet JavaScript
    let productInLocalStorage =  JSON.parse(localStorage.getItem('basket'));
    
    // j'ajoute les produits sélectionnés dans le localStorage
    const addProductLocalStorage = () => {
      // je récupère la sélection de l'utilisateur dans le tableau de l'objet :
      // on peut voir dans la console qu'il y a les données,
      // mais pas encore stockées dans le storage à ce stade
      
      productInLocalStorage.push(selection);
      // je stocke les données récupérées dans le localStorage :
      // JSON.stringify permet de convertir les données au format JavaScript en JSON 
      
      // vérifier que key et value dans l'inspecteur contiennent bien des données
      localStorage.setItem('basket', JSON.stringify(productInLocalStorage));
    }
    
    // je crée une boîte de dialogue pour confirmer l'ajout au panier
    let addConfirm = () => {
      alert('Le '+selection.name+' de couleur '+selection.color+' en '+selection.quantity+' exemplaire(s) a bien été ajouté au panier.');
    }
    
    let update = false;
    
    // s'il y a des produits enregistrés dans le localStorage
    if (productInLocalStorage) {
      
      // verifier que le produit ne soit pas deja dans le localstorage/panier
      // avec la couleur
      productInLocalStorage.forEach (function (productOk, key) {
        if (productOk.id == newID && productOk.color == selectColors.value) {
          productInLocalStorage[key].quantity = parseInt(productOk.quantity) + parseInt(selectQuantity.value);
          localStorage.setItem('basket', JSON.stringify(productInLocalStorage));
          update = true;
          addConfirm();
        }
      });
      
      //
      if (!update) {
        addProductLocalStorage();
        addConfirm();
      }
    }
    
    // s'il n'y a aucun produit enregistré dans le localStorage 
    else {
      // je crée alors un tableau avec les éléments choisi par l'utilisateur
      productInLocalStorage = [];
      addProductLocalStorage();
      addConfirm();
    }
  });