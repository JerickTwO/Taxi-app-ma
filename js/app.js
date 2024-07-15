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

  setupForms(pricingData);
}

function setupForms(pricingData) {
  const carDetails = {
    sedan: { image: "./images/sedan.png", seats: 4 },
    suv: { image: "./images/suv.png", seats: 6 }
  };

  document.querySelectorAll('.taxi-form').forEach(form => {
    form.addEventListener('submit', (event) => handleFormSubmit(event, pricingData, form));
    const carTypeSelect = form.querySelector('.car-type');
    const dropoffSelect = form.querySelector('.dropoff-form1') || form.querySelector('.dropoff-form2');
    const passengersInput = form.querySelector('.passengers');

    carTypeSelect.addEventListener('change', () => updateCarImageAndPassengers(form, carDetails));
    dropoffSelect.addEventListener('change', () => updateTotal(form, pricingData));
    passengersInput.addEventListener('input', () => updateTotal(form, pricingData));

    updateCarImageAndPassengers(form, carDetails);
  });
}

function handleFormSubmit(event, pricingData, form) {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const isValid = validateFormData(data);

  if (isValid) {
    sessionStorage.setItem(form.id, JSON.stringify(data));
    console.log('Form Data Stored:', JSON.parse(sessionStorage.getItem(form.id)));
    window.location.href = 'checkout.html';
  }
}

function validateFormData(data) {
  if (!data.pickup || !data.dropoff || !data.time || !data.date || !data.passengers) {
    alert("Todos los campos son obligatorios.");
    return false;
  }
  return true;
}

function updateCarImageAndPassengers(form, carDetails) {
  const carType = form.querySelector('.car-type').value;
  const carImage = form.querySelector('.car-image');
  const passengersInput = form.querySelector('.passengers');

  carImage.src = carDetails[carType].image;
  carImage.alt = carType.charAt(0).toUpperCase() + carType.slice(1);
  passengersInput.max = carDetails[carType].seats;
}

function updateTotal(form, pricingData) {
  const carType = form.querySelector('.car-type').value;
  const passengers = parseInt(form.querySelector('.passengers').value, 10);
  const dropoff = form.querySelector('.dropoff-form1') ? form.querySelector('.dropoff-form1').value : form.querySelector('.dropoff-form2').value;
  const priceInfo = pricingData[dropoff];
  const basePrice = carType === 'sedan' ? 50 : 80;
  const passengerPrice = priceInfo ? priceInfo[passengers] || priceInfo['default'] : 0;
  const total = basePrice + passengerPrice;

  form.querySelector('.total').value = total;
  form.querySelector('.display-total').innerText = `$${total}`;
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    document.querySelectorAll('form').forEach(form => form.reset());
    sessionStorage.clear();
  }
});
