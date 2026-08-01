function renderPersonaList(personas) {
  const personaList = document.getElementById("persona-list");

  if (!personaList) {
    return;
  }

  let cards = "";

  personas.forEach((persona) => {
    cards += `
      <div class="persona-card">
        <h3>${persona.name}</h3>

        <p><strong>Arcana:</strong> ${persona.arcana}</p>

        <p><strong>Level:</strong> ${persona.level}</p>

        <a href="persona-detail.html?id=${persona.id}" class="detail-button">
          View Detail
        </a>
      </div>
    `;
  });

  personaList.innerHTML = cards;
}

function renderPersonaDetail(personas) {
  const personaDetail = document.getElementById("persona-detail");

  if (!personaDetail) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const personaId = Number(params.get("id"));

  console.log("Persona ID:", personaId);

  const selectedPersona = personas.find((persona) => persona.id === personaId);

  if (!selectedPersona) {
    personaDetail.innerHTML = `
      <p>Persona tidak ditemukan.</p>
    `;
    return;
  }

  personaDetail.innerHTML = `
    <div class="persona-detail-card">
      <h2>${selectedPersona.name}</h2>

      <p><strong>Arcana:</strong> ${selectedPersona.arcana}</p>

      <p><strong>Level:</strong> ${selectedPersona.level}</p>
    </div>
  `;
}

// Menentukan lokasi file JSON berdasarkan halaman yang sedang dibuka
const dataPath = window.location.pathname.includes("/pages/")
  ? "../data/personas.json"
  : "data/personas.json";

// Membaca data Persona
fetch(dataPath)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Gagal memuat data: ${response.status}`);
    }

    return response.json();
  })
  .then((personas) => {
    renderPersonaList(personas);
    renderPersonaDetail(personas);
  })
  .catch((error) => {
    console.error(error);
  });
