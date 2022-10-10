//------------- Récupération du contenu du panier à partir du localstorage --------------
let basketStr = localStorage.getItem('basket');
let basket = JSON.parse(basketStr);

const cartPanel = document.querySelector('#cart__items');

//------------ Affichage des produits dans la page panier (avec les prix en fetch) ------------------
function showProductBasket(produit) {
    // AFFICHAGE DU/DES PRODUIT(S) PANIER
    // création des conteneurs HTML, insertion des articles
    let createArticle = document.createElement('article');
    createArticle.className = 'cart__item';
    createArticle.setAttribute('data-id', produit.id);
    createArticle.setAttribute('data-color', produit.color);
    cartPanel.appendChild(createArticle);

    // insertion div de l'img
    let createDivIMG = document.createElement('div');
    createDivIMG.className = 'cart__item__img';
    createArticle.appendChild(createDivIMG);

    // insertion des images
    let createPict = document.createElement('img');
    createPict.src = produit.image;
    createPict.setAttribute('alt', "Photographie d'un canapé");
    createDivIMG.appendChild(createPict);

    // insertion div content description
    let createDivContDes = document.createElement('div');
    createDivContDes.className = 'cart__item__content';
    createArticle.appendChild(createDivContDes);

    // insertion div description
    let createDivDes = document.createElement('div');
    createDivDes.className = 'cart__item__content__description';
    createDivContDes.appendChild(createDivDes);

    // insertion H2
    let createH2 = document.createElement('h2');
    createH2.textContent = produit.name;
    createDivDes.appendChild(createH2);

    // insertion P color
    let createpColor = document.createElement('p');
    createpColor.textContent = "Couleur : " + produit.color;
    createDivDes.appendChild(createpColor);

    // recupération du prix en utilisant l'id du produit
    let productUnit = "";
    fetch("http://localhost:3000/api/products/" + produit.id)
    .then(response => response.json())
    .then(async function (resultatAPI) {
        productUnit = await resultatAPI;
        // insertion P price
        let createpPrice = document.createElement('p');
        createpPrice.textContent = "Prix : " + productUnit.price + "€";
        createDivDes.appendChild(createpPrice);
    })
    .catch(error => alert("Erreur : " + error));

    // insertion div content settings
    let createDivContSet = document.createElement('div');
    createDivContSet.className = 'cart__item__content__settings';
    createDivContDes.appendChild(createDivContSet);

    // insertion div settings quantity
    let createDivContSetQuantity = document.createElement('div');
    createDivContSetQuantity.className = 'cart__item__content__settings__quantity';
    createDivContSet.appendChild(createDivContSetQuantity);

    // insertion P quantity
    let createpQuantity = document.createElement('p');
    createpQuantity.textContent = "Qté :";
    createDivContSetQuantity.appendChild(createpQuantity);

    // insertion input quantity
    let createInputQuantity = document.createElement('input');
    createInputQuantity.className = 'itemQuantity';
    createInputQuantity.setAttribute('type', 'number');
    createInputQuantity.setAttribute('name', 'itemQuantity');
    createInputQuantity.setAttribute('min', '1');
    createInputQuantity.setAttribute('max', '100');
    createInputQuantity.setAttribute('value', produit.quantity);
    createDivContSetQuantity.appendChild(createInputQuantity);

    // insertion div settings delete
    let createDivContSetDel = document.createElement('div');
    createDivContSetDel.className = 'cart__item__content__settings__delete';
    createDivContSet.appendChild(createDivContSetDel);

    // insertion P delete
    let createpDelete = document.createElement('p');
    createpDelete.className = 'deleteItem';
    createpDelete.textContent = "Supprimer";
    createDivContSetDel.appendChild(createpDelete);
}

// Récupération de produit dans l'API via son id 
async function getProduct(id) {
    return fetch("http://localhost:3000/api/products/" + id)
    .then(response => response.json())
    .catch(error => alert("Erreur : " + error));
}

// SI le panier est vide, afficher "panier vide" 
// SINON parser le panier, et utiliser la function showproductbasket 
async function showCart() {
    if (basket.length == null || basket.length == undefined || basket.length == 0){
        let createpEmpty = document.createElement('p');
        createpEmpty.textContent = 'Votre panier est vide';
        cartPanel.appendChild(createpEmpty);
    } else {   
        let totalPrice = 0;
        for (let i = 0 ; i < basket.length; i++) {
            basketProduct = basket[i];
            showProductBasket(basketProduct);
            let productsPrice = await getProduct(basketProduct.id);
            let productQuantity = basketProduct.quantity;
            totalPrice += productsPrice.price * productQuantity;
            let totalPriceElt = document.querySelector('#totalPrice');
            totalPriceElt.textContent = totalPrice;
        }
        let totalQuantity = document.querySelector('#totalQuantity');
        totalQuantity.textContent = basket.totalQuantity;
        totalProducts()
        changeQuantity()
        deleteItems()
    }
}
showCart();

//je modifie la quantité des produits
function changeQuantity() {
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    for ( let q = 0; q < itemQuantity.length; q++) {
        itemQuantity[q].addEventListener('change', (e) => {
            e.preventDefault();
            //Selection de la nouvelle quantité sauvegarder dans le localStorage avec les autres éléments
            let itemNewQuantity = itemQuantity[q].value;
            // Si l'utilisateur indique une valeur négative il aura alors une alerte aisni que le rechargement de la page
            if (itemNewQuantity <= 0) {
              return alert('Veuillez verifier la quantité choisie') + location.reload()
            };
            const newLocalStorage = {
                id: basket[q].id,
                image: basket[q].image,
                alt: basket[q].alt,
                color: basket[q].color,
                name: basket[q].name,
                quantity: itemNewQuantity, // Nouvelle quantité
            };

            //Actualisation du localStorage avec les nouvelles données
            basket[q] = newLocalStorage;
            localStorage.setItem('basket', JSON.stringify(basket));

            //Actualisation de la page + prix total
            location.reload();
        });
    }
}


//je supprime les produits dans le panier
function deleteItems() {
    const deleteItem = document.querySelectorAll('.deleteItem');
    for ( let d = 0; d < deleteItem.length; d++) {
        deleteItem[d].addEventListener('click', (e) => {
            e.preventDefault();

            //j'enregistre l'id et la couleur supprimer
            let deleteId = basket[d].id;
            let deleteColor = basket[d].color

            //filtre les élements supprimer 
            basket = basket.filter( delte => delte.id !== deleteId || delte.color !== deleteColor);

            //Actualisation du localStorage avec les nouvelles données
            localStorage.setItem('basket', JSON.stringify(basket));

            //Actualisation de la page
            location.reload();
        });
    }
}

//Nombres total de produits
function totalProducts() {
    let totalArticles = 0;
    for ( let a = 0; a < basket.length; a++) {
     const productQuantity = parseInt(basket[a].quantity, 10);
   
     totalArticles += productQuantity;
   
     const totalQuantity = document.getElementById('totalQuantity');
     totalQuantity.textContent = totalArticles;
   }
  }

// FORMULAIRE D'INSCRIPTION

// j'envoie le formulaire dans le serveur
function postForm() {
    const order = document.getElementById('order');
    order.addEventListener('click', (e) => {
      e.preventDefault();
  
      // je récupère les données du formulaire dans un objet
      // Selon les commentaires laissez par le dev back-end !
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

      if (basket.length == null || basket.length == undefined || basket.length == 0) {
        alert("Pour passer commande, veuillez ajouter des produits à votre panier");
        e.preventDefault();
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


    //Construction d'un array d'id depuis le local storage
    let productsID = [];
    for (let i = 0; i < basket.length;i++) {
        productsID.push(basket[i].id);
    }

    //console.log(productsID);
  
      const objet = {
        contact,
        products : productsID,
      }
    
      //Envoie de l'objet vers le serveur
      const options = {
        method: "POST",
        body: JSON.stringify(objet),
        headers: {
          "Content-Type" : "application/json",
          }
        };
  
        // Route menant au serveur '/order' 
        fetch("http://localhost:3000/api/products/order", options)
          .then(response => response.json())
          .then(data => {
          if (validControl()) {
            document.location.href = 'confirmation.html?id='+ data.orderId;
          }
        });
  
    }); //fin de l'eventListener
  }
  // envoi du formulaire
  postForm();