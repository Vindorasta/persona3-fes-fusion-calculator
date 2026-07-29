// ==========================
// Persona 3 FES Fusion Calculator
// JavaScript Entry Point
// ==========================

// Persona Database Example

let personas = [
  {
    name: "Orpheus",
    arcana: "Fool",
    level: 1,
  },

  {
    name: "Pixie",
    arcana: "Magician",
    level: 2,
  },

  {
    name: "Apsaras",
    arcana: "Priestess",
    level: 4,
  },
];

// ==========================
// Load Persona Database
// ==========================

// ==========================
// Load Persona Database
// ==========================

async function loadPersonas() {
  const response = await fetch("data/personas.json");

  const data = await response.json();

  personas = data;

  console.log(personas);
}

// Jalankan function

loadPersonas();

// Function untuk menampilkan Persona

function showPersonaInfo(personaData) {
  console.log("----------------");

  console.log("Name:", personaData.name);

  console.log("Arcana:", personaData.arcana);

  console.log("Level:", personaData.level);
}

// Function untuk mengecek kategori level Persona

function checkPersonaLevel(personaData) {
  if (personaData.level >= 50) {
    console.log(personaData.name, "is a High Level Persona");
  } else {
    console.log(personaData.name, "is a Low Level Persona");
  }
}

// Loop semua Persona

personas.forEach(function (persona) {
  showPersonaInfo(persona);

  checkPersonaLevel(persona);
});

// ==========================
// DOM Test
// ==========================

// Ambil elemen HTML

const searchButton = document.querySelector("#search-button");

const welcomeText = document.querySelector("#welcome-text");

// Event ketika tombol diklik

searchButton.addEventListener("click", function () {
  welcomeText.textContent = "Search button has been clicked!";
});

// ==========================
// Persona Search
// ==========================

const searchForm = document.querySelector("#search-form");

const searchInput = document.querySelector("#search-input");

const searchResult = document.querySelector("#search-result");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const keyword = searchInput.value.toLowerCase();

  const foundPersona = personas.find(function (persona) {
    return persona.name.toLowerCase() === keyword;
  });

  if (foundPersona) {
    searchResult.textContent = `Found Persona: ${foundPersona.name}`;
  } else {
    searchResult.textContent = "Persona not found";
  }
});
