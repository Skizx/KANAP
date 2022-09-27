// RECUPERER LES PRODUITS STOCKES DANS LE LOCALSTORAGE   //
//console.log(products) Affiche les id des produits dans un tableau
let products = [];
//console.log(productInLocalStorage) Affiche toute les informations des produits dans le panier
let productInLocalStorage = JSON.parse(localStorage.getItem('product'));

// AFFICHER LES PRODUITS DU PANIER

 // je sélectionne la partie html concernée par la modification
 let cartAndFormContainer = document.getElementById('cartAndFormContainer');

 // si le panier est vide : afficher 'le panier est vide'
if(productInLocalStorage === null || productInLocalStorage == 0) {
  document.querySelector("#cart__items").innerHTML =`
  <div class="cart__empty">
    <p>Votre panier est vide !</p>
  </div>`;
}
// si le panier n'est pas vide : afficher les produits dans le localStorage
else{
  let itemCards = [];
 
  // expression initiale; condition; incrémentation
  for (i = 0; i < productInLocalStorage.length; i++) {
  products.push(productInLocalStorage[i].id);
 
  // le code suivant sera injecté à chaque tour de boucle
  // selon la longueur des produits dans le local storage
  itemCards = itemCards + `
    
    <article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage.color}">
    <div class="cart__item__img">
      <img src="${productInLocalStorage[i].image}" alt="${productInLocalStorage[i].alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${productInLocalStorage[i].name}</h2>
        <p>${productInLocalStorage[i].color}</p>
        <p>${productInLocalStorage[i].price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `;
  }
  if (i === productInLocalStorage.length) {
    //trouver l'element #cart__items dans cart.html
  const itemCart = document.getElementById('cart__items');
  itemCart.innerHTML += itemCards;
  }
}

//je modifie la quantité des produits
function changeQuantity() {
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    for ( let q = 0; q < itemQuantity.length; q++) {
        itemQuantity[q].addEventListener('change', (e) => {
            e.preventDefault();
            //Selection de la nouvelle quantité sauvegarder dans le localStorage avec les autres éléments
            let itemNewQuantity = itemQuantity[q].value;
            const newLocalStorage = {
                id: productInLocalStorage[q].id,
                image: productInLocalStorage[q].image,
                alt: productInLocalStorage[q].alt,
                color: productInLocalStorage[q].color,
                name: productInLocalStorage[q].name,
                price: productInLocalStorage[q].price,
                quantity: itemNewQuantity, // Nouvelle quantité
            };

            //Actualisation du localStorage avec les nouvelles données
            productInLocalStorage[q] = newLocalStorage;
            localStorage.setItem('product', JSON.stringify(productInLocalStorage));

            alert('Votre panier est à jour.');
        });
    }
}
changeQuantity();

//je supprime les produits dans le panier
function deleteItems() {
    const deleteItem = document.querySelectorAll('.deleteItem');
    for ( let d = 0; d < deleteItem.length; d++) {
        deleteItem[d].addEventListener('click', (e) => {
            e.preventDefault();

            //j'enregistre l'id et la couleur supprimer
            let deleteId = productInLocalStorage[d].id;
            let deleteColor = productInLocalStorage[d].color

            //filtre les élements supprimer 
            //La méthode filter() crée et retourne un nouveau tableau contenant tous les éléments du tableau d'origine 
            //qui remplissent une condition déterminée par la fonction callback.
            productInLocalStorage = productInLocalStorage.filter( delte => delte.id !== deleteId || delte.color !== deleteColor);

            //Actualisation du localStorage avec les nouvelles données
            localStorage.setItem('product', JSON.stringify(productInLocalStorage));

            //Actualisation de la page
            alert('Votre article a bien été supprimé.');
            window.location.href = "cart.html";
        });
    }
}
deleteItems();