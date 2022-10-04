// RECUPERER LES PRODUITS STOCKES DANS LE LOCALSTORAGE   //
let products = [];
console.log(products) //Affiche les id des produits dans un tableau
let productInLocalStorage = JSON.parse(localStorage.getItem('product'));
console.log(productInLocalStorage) //Affiche toute les informations des produits dans le panier

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
  //console.log(itemCards);
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

            //Actualisation de la page + prix total
            location.reload();
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
            window.location.href = "cart.html";
        });
    }
}
deleteItems();

//Prix total des éléments dans le panier
function totalPrice() {
  const calculPrice = [];
  for (let p = 0; p < productInLocalStorage.length; p++) {
    //prix du produits x la quantité du produit
    const priceBasket = productInLocalStorage[p].price * productInLocalStorage[p].quantity;
    calculPrice.push(priceBasket);

    //methode reduce permet de créer une boucle et de garder en memoire le resultat des opérations
    const sumPrice = (sum, currentPrice) => sum + currentPrice;
    total = calculPrice.reduce(sumPrice);
    
    const totalBasketPrice = document.getElementById('totalPrice');
    totalBasketPrice.textContent = total;
  }
}
totalPrice();

//Nombres total de produits
function totalProducts() {
  let totalArticles = 0;
  for ( let a = 0; a < productInLocalStorage.length; a++) {
   const productQuantity = parseInt(productInLocalStorage[a].quantity, 10);
 
   totalArticles += productQuantity;
 
   const totalQuantity = document.getElementById('totalQuantity');
   totalQuantity.textContent = totalArticles;
 }
}
totalProducts();

// FORMULAIRE D'INSCRIPTION

// j'envoie le formulaire dans le serveur
function postForm() {
  const order = document.getElementById('order');
  order.addEventListener('click', (e) => {
    e.preventDefault();

    // je récupère les données du formulaire dans un objet
    const contact = {
      firstName : document.getElementById('firstName').value,
      lastName : document.getElementById('lastName').value,
      address : document.getElementById('address').value,
      city : document.getElementById('city').value,
      email : document.getElementById('email').value,
    }

    //Controle du champ de saisie du prenom
    function controlFirstName() {
      const validFirstName = contact.firstName;
      //Un objet RegExp est utilisé pour étudier les correspondances d'un texte avec un motif donné.
      let firstNameRgex = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/;
      //La méthode test() vérifie s'il y a une correspondance entre un texte et une expression rationnelle. 
      let firstNameResult = firstNameRgex.test(validFirstName);
      if ( firstNameResult == true) {
        return true
      } else {
        let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
        firstNameErrorMsg.innerText = "Le prenom choisit n'est pas correct";
      }
    }
    
    //Controle du champ de saisie du nom
    function controlLastName() {
      const validLastName = contact.lastName;
      let lastNameRgex = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/;
      let lastNameResult = lastNameRgex.test(validLastName);
      if ( lastNameResult == true) {
        return true
      } else {
        let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
        lastNameErrorMsg.innerText = "Veuillez vérifier que le nom choisit soit correct";
      }
    }

    //Controle du champ de saisie de l'adresse
    function controlAddress() {
      const validAddress = contact.address;
      let addressRgex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
      let addressResult = addressRgex.test(validAddress);
      if ( addressResult == true) {
        return true
      } else {
        let addressErrorMsg = document.getElementById('addressErrorMsg');
        addressErrorMsg.innerText = "L'adresse n'est pas valide"
      }
    }

    //Controle du champ de saisie de la ville
    function controlCity() {
      const validCity = contact.city;
      let cityRgex = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,20}$/;
      let cityResult = cityRgex.test(validCity);
      if ( cityResult == true) {
        return true
      } else {
        let cityErrorMsg = document.getElementById('cityErrorMsg');
        cityErrorMsg.innerText = "Le nom de la ville n'est pas valide"
      }
    }

    //Controle du champ de saisie de l'adresse email
    function controlEmail() {
      const validEmail = contact.email;
      let emailRgex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailResult = emailRgex.test(validEmail);
      if ( emailResult == true ) {
        return true
      } else {
        let emailErrorMsg = document.getElementById('emailErrorMsg');
        emailErrorMsg.innerText = "Veuillez verifier que l'adresse email soit bien valide"
      }
    }

    //j'envoie l'objet contact ou sont receuillis les données remplis du formulaire dans le localStorage
    function validControl() {
      if (controlFirstName() && controlLastName() && controlAddress() && controlCity() && controlEmail()) {
        localStorage.setItem('contact', JSON.stringify(contact));
        return true
      } else {
        alert('Certaines informations du formulaire ne sont pas valide')
      }
    }
    validControl();


    const objet = {
      contact,
      products,
    }
  
    //Envoie de l'objet vers le serveur
    const options = {
      method: "POST",
      body: JSON.stringify(objet),
      headers: {
        "Content-Type" : "application/json",
        }
      };

      fetch("http://localhost:3000/api/products/order", options)
        .then(response => response.json())
        .then(data => {
        localStorage.setItem('orderId', data.orderId);
        if (validControl()) {
          document.location.href = 'confirmation.html?id='+ data.orderId;
        }
      });

  }); //fin de l'eventListener
}
// envoi du formulaire
postForm();