document.addEventListener('DOMContentLoaded', () => {
  // Inicializa los pickers de fecha y hora para todos los formularios
  document.querySelectorAll('.date').forEach(element => {
    flatpickr(element, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      minDate: "today", 
      locale:"es"
    });
  });

  document.querySelectorAll('.timepicker').forEach(element => {
    flatpickr(element, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      time_24hr: false,
      locale:"es"
    });
  });

  // Mapa de tipos de carros a sus imágenes correspondientes
  const carImages = {
    sedan: "./images/sedan.png",
    suv: "./images/suv.png"
  };

  // Función para cambiar la imagen del carro según el tipo seleccionado
  function changeCarImage(form) {
    const carType = form.querySelector('.car-type').value;
    const carImage = carImages[carType];
    form.querySelector('.car-image').src = carImage;
    form.querySelector('.car-image').alt = carType.charAt(0).toUpperCase() + carType.slice(1);
    form.querySelector('.car-type-label').innerText = carType.charAt(0).toUpperCase() + carType.slice(1);
  }

  // Función para calcular y actualizar el total
  function updateTotal(form) {
    const carType = form.querySelector('.car-type').value;
    const passengers = parseInt(form.querySelector('.passengers').value, 10);
    const dropoff = form.querySelector('.dropoff');
    const dropoffPrice = dropoff.options[dropoff.selectedIndex].dataset.price || 0;

    const basePrices = {
      sedan: 50,
      suv: 80
    }; // Precios base por tipo de carro

    const total = basePrices[carType] + parseInt(dropoffPrice) + passengers;
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
      const dropoff = form.querySelector('.dropoff');
      const dropoffPrice = dropoff.options[dropoff.selectedIndex].dataset.price || 0;

      const basePrices = {
        sedan: 50,
        suv: 80
      }; // Precios base por tipo de carro

      const total = basePrices[carType] + parseInt(dropoffPrice) + passengers;
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
});
