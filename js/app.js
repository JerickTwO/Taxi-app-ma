// Esperar hasta que el DOM esté completamente cargado
window.addEventListener('pageshow', (event) => {
  // Limpiar sessionStorage para resetear valores
  sessionStorage.removeItem('form1');
  sessionStorage.removeItem('form2');

  console.log("DOM completamente cargado y parseado");

  // Restablecer los valores por defecto en los select
  document.querySelectorAll('select').forEach(select => {
    select.selectedIndex = 0; // Seleccionar la opción por defecto
  });

  fetch('./locations/pricing.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(pricingData => {
      console.log('Datos de precios cargados:', pricingData);
      initApp(pricingData);
    })
    .catch(error => {
      console.error('Error al cargar pricingData:', error);
    });
});

function initApp(pricingData) {
  console.log('Iniciando aplicación...');

  // Inicializa los pickers de fecha y hora para todos los formularios
  document.querySelectorAll('.datepicker').forEach(element => {
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

  const carDetails = {
    sedan: { image: "./images/sedan.png", seats: 4 },
    suv: { image: "./images/suv.png", seats: 6 }
  };

  function changeCarImage(form) {
    const carType = form.querySelector('.car-type');
    if (!carType) {
      console.error('carType no encontrado');
      return;
    }
    const carDetail = carDetails[carType.value];
    const carImage = form.querySelector('.car-image');
    if (!carImage) {
      console.error('carImage no encontrado');
      return;
    }
    carImage.src = carDetail.image;
    carImage.alt = carType.value.charAt(0).toUpperCase() + carType.value.slice(1);
    form.querySelector('.car-type-label').innerText = carType.value.charAt(0).toUpperCase() + carType.value.slice(1);
    form.querySelector('.passengers').max = carDetail.seats;
  }

  function updateTotal(form, formNumber) {
    const carTypeElement = form.querySelector('.car-type');
    const passengersElement = form.querySelector('.passengers');
    const dropoffElement = form.querySelector(`.dropoff-form${formNumber}`);
    const totalElement = form.querySelector(`#display-total-form${formNumber}`);
    if (!carTypeElement || !passengersElement || !dropoffElement || !totalElement) {
      console.error('Elementos necesarios no encontrados en el formulario', formNumber);
      return;
    }
    const carType = carTypeElement.value;
    const passengers = parseInt(passengersElement.value, 10);
    const dropoff = dropoffElement.value;
    const dropoffPrice = pricingData.interregional[dropoff] || pricingData.metropolitan[dropoff] || pricingData.ruralMetropolitana[dropoff];

    if (!dropoffPrice) {
      console.error('Precio de dropoff no encontrado para', dropoff);
      return;
    }

    const basePrices = {
      sedan: 50,
      suv: 80
    };

    console.log(`Calculando total para: ${dropoff}, pasajeros: ${passengers}, tipo de carro: ${carType}`);

    let passengerPrice = 0;
    if (passengers <= 2) {
      passengerPrice = dropoffPrice["1-2"];
    } else {
      passengerPrice = dropoffPrice[passengers] || dropoffPrice["1-2"];
    }

    console.log(`Precio base: ${basePrices[carType]}, Precio por pasajeros: ${passengerPrice}`);

    const total = basePrices[carType] + passengerPrice;
    form.querySelector('.total').value = total;
    totalElement.innerText = `$${total}`;
  }

  document.querySelectorAll('.taxi-form').forEach(form => {
    const carTypeElement = form.querySelector('.car-type');
    const dropoffElement1 = form.querySelector('.dropoff-form1');
    const dropoffElement2 = form.querySelector('.dropoff-form2');
    const passengersElement = form.querySelector('.passengers');

    if (!carTypeElement || !passengersElement) {
      console.error('Elementos de tipo de carro o pasajeros no encontrados');
      console.log('carTypeElement:', carTypeElement);
      console.log('passengersElement:', passengersElement);
      return;
    }

    carTypeElement.addEventListener('change', () => {
      changeCarImage(form);
      if (dropoffElement1) {
        updateTotal(form, 1);
      } else if (dropoffElement2) {
        updateTotal(form, 2);
      }
    });

    if (dropoffElement1) {
      dropoffElement1.addEventListener('change', () => updateTotal(form, 1));
    } else if (dropoffElement2) {
      dropoffElement2.addEventListener('change', () => updateTotal(form, 2));
    }
    passengersElement.addEventListener('input', () => {
      if (dropoffElement1) {
        updateTotal(form, 1);
      } else if (dropoffElement2) {
        updateTotal(form, 2);
      }
    });

    changeCarImage(form);
  });

  document.getElementById('btn1').addEventListener('click', () => {
    document.getElementById('form1').classList.remove('hidden');
    document.getElementById('form2').classList.add('hidden');
  });

  document.getElementById('btn2').addEventListener('click', () => {
    document.getElementById('form1').classList.add('hidden');
    document.getElementById('form2').classList.remove('hidden');
  });

  const dropoffSelectForm1 = document.querySelector('.dropoff-form1');
  const dropoffSelectForm2 = document.querySelector('.dropoff-form2');

  console.log('dropoffSelectForm1:', dropoffSelectForm1);
  console.log('dropoffSelectForm2:', dropoffSelectForm2);

  if (!dropoffSelectForm1) {
    console.error('dropoffSelectForm1 no encontrado');
  }
  if (!dropoffSelectForm2) {
    console.error('dropoffSelectForm2 no encontrado');
  }

  const allLocations = { ...pricingData.interregional, ...pricingData.metropolitan, ...pricingData.ruralMetropolitana };

  Object.keys(allLocations).forEach(location => {
    const option1 = document.createElement('option');
    option1.value = location;
    option1.textContent = location;
    if (dropoffSelectForm1) {
      dropoffSelectForm1.appendChild(option1);
    }
    const option2 = document.createElement('option');
    option2.value = location;
    option2.textContent = location;
    if (dropoffSelectForm2) {
      dropoffSelectForm2.appendChild(option2);
    }
  });
}

// Manejar la presentación del formulario y almacenamiento en sessionStorage
document.getElementById('taxiForm1').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const pickup1 = document.querySelector('.pickup-form1').value;
  const dropoff1 = document.querySelector('.dropoff-form1').value;
  const time1 = document.querySelector('.timepicker').value;
  const carType1 = document.querySelector('.car-type').value;
  const date1 = document.querySelector('.datepicker').value;
  const passengers1 = document.querySelector('.passengers').value;
  const total1 = document.querySelector('#display-total-form1').innerText.replace('$', '');

  // Log form values for debugging
  console.log('Form 1 Values:', { pickup1, dropoff1, time1, carType1, date1, passengers1, total1 });

  // Store values in sessionStorage
  sessionStorage.setItem('form1', JSON.stringify({
    pickup: pickup1,
    dropoff: dropoff1,
    time: time1,
    carType: carType1,
    date: date1,
    passengers: passengers1,
    total: total1
  }));

  // Redirect to cart page
  window.location.href = 'checkout.html';
});

document.getElementById('taxiForm2').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const pickup2 = document.querySelector('.pickup-form2').value;
  const dropoff2 = document.querySelector('.dropoff-form2').value;
  const time2 = document.querySelector('.timepicker').value;
  const carType2 = document.querySelector('.car-type').value;
  const date2 = document.querySelector('.datepicker').value;
  const passengers2 = document.querySelector('.passengers').value;
  const total2 = document.querySelector('#display-total-form2').innerText.replace('$', '');

  // Log form values for debugging
  console.log('Form 2 Values:', { pickup2, dropoff2, time2, carType2, date2, passengers2, total2 });

  // Store values in sessionStorage
  sessionStorage.setItem('form2', JSON.stringify({
    pickup: pickup2,
    dropoff: dropoff2,
    time: time2,
    carType: carType2,
    date: date2,
    passengers: passengers2,
    total: total2
  }));

  // Verify that data is stored correctly
  console.log('Stored Form 2 Data:', JSON.parse(sessionStorage.getItem('form2')));

  // Redirect to cart page
  window.location.href = 'checkout.html';
});
