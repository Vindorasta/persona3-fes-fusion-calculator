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

function calculateFusion(arcanaA, arcanaB, fusionChart) {
  const fusionResult = fusionChart.find((fusion) => {
    return (
      (fusion.arcana1 === arcanaA && fusion.arcana2 === arcanaB) ||
      (fusion.arcana1 === arcanaB && fusion.arcana2 === arcanaA)
    );
  });

  if (!fusionResult) {
    return null;
  }

  return fusionResult.resultArcana;
}

function renderFusionOptions(personas) {
  const selectA = document.getElementById("persona-a");
  const selectB = document.getElementById("persona-b");

  if (!selectA || !selectB) {
    return;
  }

  let options = "";

  personas.forEach((persona) => {
    options += `
      <option value="${persona.id}">
        ${persona.name}
      </option>
    `;
  });

  selectA.innerHTML = options;
  selectB.innerHTML = options;
}

function handleFusion(personas, skills, arcanas, fusionChart) {
  const selectA = document.getElementById("persona-a");
  const selectB = document.getElementById("persona-b");
  const resultBox = document.getElementById("fusion-result");

  if (!selectA || !selectB || !resultBox) {
    return;
  }

  const personaAId = Number(selectA.value);
  const personaBId = Number(selectB.value);

  const personaA = personas.find((persona) => persona.id === personaAId);

  const personaB = personas.find((persona) => persona.id === personaBId);

  const arcanaA = arcanas.find((arcana) => arcana.id === personaA.arcanaId);

  const arcanaB = arcanas.find((arcana) => arcana.id === personaB.arcanaId);

  const result = calculateFusion(arcanaA.name, arcanaB.name, fusionChart);

  const fusionPersona = findFusionPersona(
    result,
    personaA,
    personaB,
    personas,
    arcanas,
  );

  if (!result) {
    resultBox.innerHTML = `
      <p>
        Fusion tidak ditemukan.
      </p>
    `;

    return;
  }

  renderFusionResult(resultBox, result, fusionPersona, skills);
}

function setupFusionButton(personas, skills, arcanas, fusionChart) {
  const button = document.getElementById("fusion-button");

  if (!button) {
    return;
  }

  button.addEventListener("click", () => {
    handleFusion(personas, skills, arcanas, fusionChart);
  });
}

function findFusionPersona(
  resultArcana,
  personaA,
  personaB,
  personas,
  arcanas,
) {
  const averageLevel = Math.floor((personaA.level + personaB.level) / 2);

  const candidates = personas.filter((persona) => {
    const arcana = arcanas.find((a) => a.id === persona.arcanaId);

    return arcana?.name === resultArcana;
  });

  if (candidates.length === 0) {
    return null;
  }

  const closestPersona = candidates.reduce((closest, persona) => {
    const currentDifference = Math.abs(persona.level - averageLevel);

    const closestDifference = Math.abs(closest.level - averageLevel);

    return currentDifference < closestDifference ? persona : closest;
  });

  return closestPersona;
}

function renderFusionResult(resultBox, resultArcana, fusionPersona, skills) {
  if (!fusionPersona) {
    resultBox.innerHTML = `
      <p>
        Persona hasil fusion tidak ditemukan.
      </p>
    `;

    return;
  }

  const personaSkills = skills.filter((skill) =>
    fusionPersona.skillIds?.includes(skill.id),
  );

  let skillHTML = "";

  personaSkills.forEach((skill) => {
    skillHTML += `
      <li>
        ${skill.name}
      </li>
    `;
  });

  resultBox.innerHTML = `

    <div class="persona-card fusion-result-card">

      <h2>
        ${fusionPersona.name}
      </h2>


      <p>
        <strong>Arcana:</strong>
        ${resultArcana}
      </p>


      <p>
        <strong>Level:</strong>
        ${fusionPersona.level}
      </p>


      <p>
        <strong>Skills:</strong>
      </p>


      <ul>
        ${skillHTML || "<li>-</li>"}
      </ul>


    </div>

  `;
}
// Menentukan lokasi file JSON berdasarkan halaman yang sedang dibuka
const isPages = window.location.pathname.includes("/pages/");

const personasPath = isPages ? "../data/personas.json" : "data/personas.json";

const skillsPath = isPages ? "../data/skills.json" : "data/skills.json";

const arcanasPath = isPages ? "../data/arcanas.json" : "data/arcanas.json";

const fusionChartPath = isPages
  ? "../data/fusionChart.json"
  : "data/fusionChart.json";
// Membaca data Persona
Promise.all([
  fetch(personasPath),
  fetch(skillsPath),
  fetch(arcanasPath),
  fetch(fusionChartPath),
])
  .then((responses) => {
    responses.forEach((response) => {
      if (!response.ok) {
        throw new Error(`Gagal memuat data: ${response.status}`);
      }
    });

    return Promise.all(responses.map((response) => response.json()));
  })
  .then(([personas, skills, arcanas, fusionChart]) => {
    console.log("PERSONAS:");
    console.log(personas);

    console.log("SKILLS:");
    console.log(skills);

    console.log("ARCANAS:");
    console.log(arcanas);

    console.log("FUSION CHART:");
    console.log(fusionChart);

    console.log(calculateFusion("Fool", "Magician", fusionChart));
    renderPersonaList(personas);
    renderPersonaDetail(personas, skills, arcanas);

    renderFusionOptions(personas);

    setupFusionButton(personas, skills, arcanas, fusionChart);
  })
  .catch((error) => {
    console.error(error);
  });
