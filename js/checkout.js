// Esperar hasta que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', (event) => {
  // Recuperar los datos de sessionStorage
  const form1 = JSON.parse(sessionStorage.getItem('form1'));
  const form2 = JSON.parse(sessionStorage.getItem('form2'));

  // Función para actualizar el DOM con los datos del formulario
  function updateDOM(form) {
    const carTypeToImage = {
      sedan: 'images/sedan.png',
      suv: 'images/suv.png',
      // Añade más tipos de coche y sus imágenes correspondientes aquí
    };
    const carType = form.carType.toLowerCase(); // Asegurarse de que sea minúscula para evitar errores

    document.getElementById('car-image').src = carTypeToImage[carType] || 'images/default.png'; // Cambia la imagen según el tipo de coche
    document.getElementById('car-type').textContent = `${form.carType}`;
    document.getElementById('car-subtotal').textContent = `$${form.total}`;
    document.getElementById('subtotal').textContent = `$${form.total}`;
    document.getElementById('discount').textContent = `-$0.50`; // Ejemplo de descuento
    document.getElementById('total').textContent = `$${(form.total - 0.50).toFixed(2)}`; // Actualiza el total considerando el descuento

    // Poblar los detalles de la reserva
    document.getElementById('from').textContent = form.pickup;
    document.getElementById('to').textContent = form.dropoff;
    document.getElementById('date').textContent = form.date;
    document.getElementById('time').textContent = form.time;
    document.getElementById('passengers').textContent = form.passengers;
  }

  // Verificar si los datos están presentes y actualizar el DOM
  if (form1) {
    updateDOM(form1);
  } else if (form2) {
    updateDOM(form2);
  }
});
