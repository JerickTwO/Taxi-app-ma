// Función para obtener los parámetros de la URL
function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
      carType: urlParams.get('car-type'),
      total: urlParams.get('total'),
      pickup: urlParams.get('pickup'),
      dropoff: urlParams.get('dropoff'),
      date: urlParams.get('date'),
      time: urlParams.get('time'),
      passengers: urlParams.get('passengers'),
      price: urlParams.get('price') // Añadimos el parámetro price
  };
}

// Objeto con los enlaces a las imágenes correspondientes a cada tipo de carro
const carImages = {
  sedan: "./images/sedan.png",
  suv: "./images/suv.png"
  // Agrega más tipos de carros e imágenes si es necesario
};

// Función para actualizar la vista con los datos recibidos
function updateView(params) {
  const carTypeCapitalized = params.carType.charAt(0).toUpperCase() + params.carType.slice(1);
  
  document.getElementById('selected-car-title').innerHTML = `
      <strong>Carro: </strong> ${carTypeCapitalized} <br>
      <strong>Desde: </strong> ${params.pickup.toUpperCase()} <br>
      <strong>Traslado a: </strong> ${params.dropoff} <br>
      <strong>Día: </strong> ${params.date} <br>
      <strong>Hora: </strong> ${params.time}
  `;
  
  document.getElementById('selected-car-image').src = carImages[params.carType];
  document.getElementById('cart-items').innerText = `Pasajeros: ${params.passengers}`;
  document.getElementById('total-price').innerText = `$${params.total}`;
}

// Función para manejar el envío del formulario
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  
  // Construir la URL con los parámetros del formulario
  const params = new URLSearchParams(formData);
  window.location.href = `cart.html?${params.toString()}`;
}

// Agregar event listeners a los formularios
document.addEventListener('DOMContentLoaded', function() {
  const form1 = document.getElementById('taxi-form');
  const form2 = document.querySelector('#form2 #taxi-form');

  if (form1) form1.addEventListener('submit', handleSubmit);
  if (form2) form2.addEventListener('submit', handleSubmit);

  // Si estamos en la página del carrito, actualizar la vista
  if (window.location.pathname.includes('cart.html')) {
      const params = getUrlParams();
      updateView(params);
  }
});