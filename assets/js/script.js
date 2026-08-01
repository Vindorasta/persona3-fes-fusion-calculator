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

function renderPersonaDetail(personas, skills, arcanas) {
  const personaDetail = document.getElementById("persona-detail");

  if (!personaDetail) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const personaId = Number(params.get("id"));

  console.log("Persona ID:", personaId);

  const selectedPersona = personas.find((persona) => persona.id === personaId);
  const selectedArcana = arcanas.find(
    (arcana) => arcana.id === selectedPersona.arcanaId,
  );
  const personaSkills = skills.filter((skill) =>
    (selectedPersona.skillIds || []).includes(skill.id),
  );

  if (!selectedPersona) {
    personaDetail.innerHTML = `
      <p>Persona tidak ditemukan.</p>
    `;
    return;
  }

  personaDetail.innerHTML = `
    <div class="persona-detail-card">
      <h2>${selectedPersona.name}</h2>

      <p><strong>Arcana:</strong> ${selectedArcana ? selectedArcana.name : "Unknown"}</p>

<p>
  <strong>Level:</strong>
  ${selectedPersona.level}
</p>

<p>
  <strong>Skills:</strong>
</p>

<ul>
  ${personaSkills
    .map(
      (skill) => `
        <li>
          <strong>${skill.name}</strong>
          <br>
          Type: ${skill.type || "-"}
          <br>
          Element: ${skill.element || "-"}
        </li>
      `,
    )
    .join("")}
</ul>
    </div>
  `;
}

// Menentukan lokasi file JSON berdasarkan halaman yang sedang dibuka
const isPages = window.location.pathname.includes("/pages/");

const personasPath = isPages ? "../data/personas.json" : "data/personas.json";

const skillsPath = isPages ? "../data/skills.json" : "data/skills.json";

const arcanasPath = isPages ? "../data/arcanas.json" : "data/arcanas.json";
// Membaca data Persona
Promise.all([fetch(personasPath), fetch(skillsPath), fetch(arcanasPath)])
  .then((responses) => {
    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat data: ${response.status}`);
      }
    });

    return Promise.all(responses.map((response) => response.json()));
  })
  .then(([personas, skills, arcanas]) => {
    console.log("PERSONAS:");
    console.log(personas);

    console.log("SKILLS:");
    console.log(skills);

    console.log("ARCANAS:");
    console.log(arcanas);

    renderPersonaList(personas);
    renderPersonaDetail(personas, skills, arcanas);
  })
  .catch((error) => {
    console.error(error);
  });
