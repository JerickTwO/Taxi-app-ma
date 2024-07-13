document.addEventListener('DOMContentLoaded', () => {
  fetch('./locations/pricing.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(pricingData => {
      console.log(pricingData); // Verifica que los datos se carguen correctamente
      initApp(pricingData);
    })
    .catch(error => {
      console.error('Error al cargar pricingData:', error);
    });
});

function initApp(pricingData) {
  console.log('Iniciando aplicación...'); // Mensaje de depuración

  // Inicializa los pickers de fecha y hora para todos los formularios
  document.querySelectorAll('.date').forEach(element => {
    flatpickr(element, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      minDate: "today"
    });
  });

  document.querySelectorAll('.timepicker').forEach(element => {
    flatpickr(element, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      time_24hr: false
    });
  });

  // Mapa de tipos de carros a sus imágenes correspondientes y límites de asientos
  const carDetails = {
    sedan: { image: "./images/sedan.png", seats: 4 },
    suv: { image: "./images/suv.png", seats: 6 }
  };

  // Función para cambiar la imagen del carro según el tipo seleccionado
  function changeCarImage(form) {
    const carType = form.querySelector('.car-type').value;
    const carDetail = carDetails[carType];
    form.querySelector('.car-image').src = carDetail.image;
    form.querySelector('.car-image').alt = carType.charAt(0).toUpperCase() + carType.slice(1);
    form.querySelector('.car-type-label').innerText = carType.charAt(0).toUpperCase() + carType.slice(1);
    form.querySelector('.passengers').max = carDetail.seats;
  }

  // Función para calcular y actualizar el total
  function updateTotal(form) {
    const carType = form.querySelector('.car-type').value;
    const passengers = parseInt(form.querySelector('.passengers').value, 10);
    const dropoff = form.querySelector('.dropoff').value;
    const dropoffPrice = pricingData.interregional[dropoff] || pricingData.metropolitan[dropoff] || pricingData.ruralMetropolitana[dropoff];

    const basePrices = {
      sedan: 50,
      suv: 80
    }; // Precios base por tipo de carro

    let passengerPrice = 0;
    if (passengers <= 2) {
      passengerPrice = dropoffPrice["1-2"];
    } else {
      passengerPrice = dropoffPrice[passengers] || dropoffPrice["1-2"]; // Manejo de errores si el número de pasajeros excede el límite
    }

    const total = basePrices[carType] + passengerPrice;
    form.querySelector('.total').value = total;
    form.querySelector('#display-total').innerText = total;
  }

  // Inicializa la imagen del carro al cargar la página y añade eventos de cambio
  document.querySelectorAll('.taxi-form').forEach(form => {
    const carTypeElement = form.querySelector('.car-type');
    const dropoffElement = form.querySelector('.dropoff');
    const passengersElement = form.querySelector('.passengers');

    carTypeElement.addEventListener('change', () => {
      changeCarImage(form);
      updateTotal(form);
    });

    dropoffElement.addEventListener('change', () => updateTotal(form));
    passengersElement.addEventListener('input', () => updateTotal(form));

    changeCarImage(form);

    // Calcular el total y asignarlo al campo oculto
    form.addEventListener('submit', function(event) {
      const carType = form.querySelector('.car-type').value;
      const passengers = parseInt(form.querySelector('.passengers').value, 10);
      const dropoff = form.querySelector('.dropoff').value;
      const dropoffPrice = pricingData.interregional[dropoff] || pricingData.metropolitan[dropoff] || pricingData.ruralMetropolitana[dropoff];

      const basePrices = {
        sedan: 50,
        suv: 80
      }; // Precios base por tipo de carro

      let passengerPrice = 0;
      if (passengers <= 2) {
        passengerPrice = dropoffPrice["1-2"];
      } else {
        passengerPrice = dropoffPrice[passengers] || dropoffPrice["1-2"]; // Manejo de errores si el número de pasajeros excede el límite
      }

      const total = basePrices[carType] + passengerPrice;
      form.querySelector('.total').value = total;

      // Validación personalizada para campos de fecha, hora y select
      const dateInput = form.querySelector('.date');
      const timeInput = form.querySelector('.timepicker');
      const pickupSelect = form.querySelector('.pickup');
      const dropoffSelect = form.querySelector('.dropoff');
      const carTypeSelect = form.querySelector('.car-type');

      if (!dateInput.value) {
        alert("Por favor, elija una fecha.");
        event.preventDefault();
        return;
      }

      if (!timeInput.value) {
        alert("Por favor, elija una hora.");
        event.preventDefault();
        return;
      }

      if (pickupSelect.value === "") {
        alert("Por favor, selecciona tu ubicación.");
        event.preventDefault();
        return;
      }

      if (dropoffSelect.value === "") {
        alert("Por favor, selecciona tu destino.");
        event.preventDefault();
        return;
      }

      if (carTypeSelect.value === "") {
        alert("Por favor, selecciona el vehículo.");
        event.preventDefault();
        return;
      }

      if (passengers > carDetails[carType].seats) {
        alert(`El vehículo seleccionado solo puede transportar hasta ${carDetails[carType].seats} pasajeros.`);
        event.preventDefault();
        return;
      }
    });
  });

  // Función para scroll suave a secciones específicas
  function scrollToSection(event, sectionId) {
    event.preventDefault();
    document.getElementById(sectionId).scrollIntoView({
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('.btn-scroll').forEach(button => {
    button.addEventListener('click', (event) => {
      const sectionId = button.getAttribute('data-target');
      scrollToSection(event, sectionId);
    });
  });

  // Alternar visibilidad de formularios
  document.getElementById('btn1').addEventListener('click', () => {
    document.querySelectorAll('.form-container')[0].classList.remove('hidden');
    document.querySelectorAll('.form-container')[1].classList.add('hidden');
  });

  document.getElementById('btn2').addEventListener('click', () => {
    document.querySelectorAll('.form-container')[0].classList.add('hidden');
    document.querySelectorAll('.form-container')[1].classList.remove('hidden');
  });

  // Poblar los select inputs con los datos de precios
  const dropoffSelectForm1 = document.querySelector('.form1:first-of-type .pickup');
  const pickupSelectForm2 = document.querySelector('.form2:last-of-type .dropoff');

  console.log('dropoffSelectForm1:', dropoffSelectForm1); // Agregar mensaje de consola
  console.log('pickupSelectForm2:', pickupSelectForm2);   // Agregar mensaje de consola

  if (!dropoffSelectForm1) {
    console.error('dropoffSelectForm1 no encontrado');
  }
  if (!pickupSelectForm2) {
    console.error('pickupSelectForm2 no encontrado');
  }

  const allLocations = { ...pricingData.interregional, ...pricingData.metropolitan, ...pricingData.ruralMetropolitana };

  Object.keys(allLocations).forEach(location => {
    if (dropoffSelectForm1) {
      const option1 = document.createElement('option');
      option1.value = location;
      option1.textContent = location;
      dropoffSelectForm1.appendChild(option1);
    }

    if (pickupSelectForm2) {
      const option2 = document.createElement('option');
      option2.value = location;
      option2.textContent = location;
      pickupSelectForm2.appendChild(option2);
    }
  });
}
