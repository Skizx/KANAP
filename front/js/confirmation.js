// je crée une nouvelle url à partir de l'url actuelle 
let params = new URL(window.location.href).searchParams;
// j'indique que la nouvelle url sera ajoutée d'un id :
let newID = params.get('id');
//console.log(newID) 

const orderId = document.getElementById('orderId');
orderId.innerHTML = newID;

localStorage.clear();