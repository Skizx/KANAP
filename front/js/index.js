//---------JE FAIS APPEL A L'API QUI CONTIENT LES PRODUITS---------

//je demande à fetch de récupérer les données depuis l'url de l'API : 
fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => { 
    createProducts(data);
    //console.log(data) //vérification de la liste des produits
  })
  .catch(_error => {
    alert('Oops ! Le serveur ne répond pas.');
  });

  //---------J'AFFICHE TOUS LES PRODUITS---------

function createProducts(data) {
    // pour ma variable product de ma promise .then data
    for (product of data) {
        // trouver l'élément #items dans index.html...
        const itemCard = document.getElementById('items');
        
        itemCard.innerHTML +=`
        <a href="./product.html?id=${product._id}">
        <article>
          <img src="${product.imageUrl}" alt="${product.altTxt}">
          <h3 class="productName">${product.name}</h3>
          <p class="productDescription">${product.description}</p>
        </article>
        </a>
      `; 
    }
}
