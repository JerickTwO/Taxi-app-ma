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


  // Store values in localStorage
  localStorage.setItem('form1', JSON.stringify({
    pickup: pickup1,
    dropoff: dropoff1,
    time: time1,
    carType: carType1,
    date: date1,
    passengers: passengers1,
    total: total1
  }));

  // Redirect to cart page
  window.location.href = 'cart.html';
});

document.getElementById('taxiForm2').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form values
  const pickup2 = document.querySelector('.pickup-form2').value;
  const dropoff2 = document.querySelector('.dropoff-form2').value;
  const time2 = document.querySelector('.timepicker').value;
  const carType2 = document.querySelector('.car-type').value;
  const date2 = document.querySelector('.date').value;
  const passengers2 = document.querySelector('.passengers').value;
  const total2 = document.querySelector('#display-total-form2').innerText.replace('$', '');

  // Store values in localStorage
  localStorage.setItem('form2', JSON.stringify({
    pickup: pickup2,
    dropoff: dropoff2,
    timepicker: time2,
    carType: carType2,
    datepicker: date2,
    passengers: passengers2,
    total: total2
  }));

});

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM completamente cargado y parseado");

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

  function updateTotalForm1() {
    const form = document.getElementById('form1');
    if (!form) {
      console.error('Formulario 1 no encontrado');
      return;
    }
    const carTypeElement = form.querySelector('.car-type');
    const passengersElement = form.querySelector('.passengers');
    const dropoffElement = form.querySelector('.dropoff-form1');
    const totalElement = form.querySelector('#display-total-form1');
    if (!carTypeElement || !passengersElement || !dropoffElement || !totalElement) {
      console.error('Elementos necesarios no encontrados en el formulario 1');
      console.log('carTypeElement:', carTypeElement);
      console.log('passengersElement:', passengersElement);
      console.log('dropoffElement:', dropoffElement);
      console.log('totalElement:', totalElement);
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

  function updateTotalForm2() {
    const form = document.getElementById('form2');
    if (!form) {
      console.error('Formulario 2 no encontrado');
      return;
    }
    const carTypeElement = form.querySelector('.car-type');
    const passengersElement = form.querySelector('.passengers');
    const dropoffElement = form.querySelector('.dropoff-form2');
    const totalElement = form.querySelector('#display-total-form2');
    if (!carTypeElement || !passengersElement || !dropoffElement || !totalElement) {
      console.error('Elementos necesarios no encontrados en el formulario 2');
      console.log('carTypeElement:', carTypeElement);
      console.log('passengersElement:', passengersElement);
      console.log('dropoffElement:', dropoffElement);
      console.log('totalElement:', totalElement);
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
        updateTotalForm1();
      } else if (dropoffElement2) {
        updateTotalForm2();
      }
    });

    if (dropoffElement1) {
      dropoffElement1.addEventListener('change', updateTotalForm1);
    } else if (dropoffElement2) {
      dropoffElement2.addEventListener('change', updateTotalForm2);
    }
    passengersElement.addEventListener('input', () => {
      if (dropoffElement1) {
        updateTotalForm1();
      } else if (dropoffElement2) {
        updateTotalForm2();
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
  const pickupSelectForm2 = document.querySelector('.dropoff-form2');

  console.log('dropoffSelectForm1:', dropoffSelectForm1);
  console.log('pickupSelectForm2:', pickupSelectForm2);

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
