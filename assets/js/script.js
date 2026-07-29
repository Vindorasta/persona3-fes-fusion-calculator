// Mengambil data Persona dari file JSON

fetch("data/personas.json")
  .then((response) => response.json())

  .then((personas) => {
    console.log(personas);
  });
