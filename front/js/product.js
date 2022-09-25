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
  
  //je configure un eventListener quand l'utilisateur clique sur ajouter au panier
  const addToCart = document.getElementById('addToCart');
  //console.log(addToCart);
  if(addToCart != null) {
    addToCart.addEventListener('click', function(e) {
      //je desactive l'evenement par défault (href = page du panier)
      e.preventDefault(); {
        console.log(e);
        //je recupere les donnees par rapport au choix de l'utilisateur
        const addColors = document.getElementById('colors').value;
        const addQuantity = document.getElementById('quantity').value;
      //si l'utilisateur ne choisit pas de couleur ou de quantité alors il aura une alerte
      if (addColors == null || addColors === "" || addQuantity == null || addQuantity == 0)
      alert("Veuillez ajoutez une couleur ainsi qu'une quantité")
      const selection = {
        id: newID,
        color: addColors,
        quantity: addQuantity,
      }
      localStorage.setItem(newID, JSON.stringify(selection));
      window.location.href = "cart.html";
      }
    });

  }
 