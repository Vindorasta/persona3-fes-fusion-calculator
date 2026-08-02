function renderPersonaList(personas) {
  const personaList = document.getElementById("persona-list");

  if (!personaList) {
    return;
  }

  if (personas.length === 0) {
    personaList.innerHTML = `

    <div class="empty-state">

      <h3>
        Persona tidak ditemukan
      </h3>

      <p>
        Coba gunakan keyword lain
        atau ubah filter.
      </p>

    </div>

  `;

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

    <div class="persona-header">

      <h2>
        ${selectedPersona.name}
      </h2>

      <span class="arcana-badge">
        ${selectedArcana ? selectedArcana.name : "Unknown"}
      </span>

    </div>


    <div class="persona-info">

      <p>
        <strong>Level:</strong>
        ${selectedPersona.level}
      </p>

    </div>


    <div class="persona-affinity">

      <h3>
        Affinity
      </h3>


      <div>
        <strong>Strength:</strong>

        ${
          selectedPersona.strengths
            ?.map((item) => `<span class="skill-badge">${item}</span>`)
            .join("") || "-"
        }

      </div>


      <div>
        <strong>Weakness:</strong>

        ${
          selectedPersona.weakness
            ?.map((item) => `<span class="skill-badge">${item}</span>`)
            .join("") || "-"
        }

      </div>

    </div>



    <div class="persona-skills">

      <h3>
        Skills
      </h3>


      <div class="skill-container">

        ${
          personaSkills
            .map(
              (skill) =>
                `
                <span class="skill-badge">
                  ${skill.name}
                </span>
                `,
            )
            .join("") || "-"
        }

      </div>

    </div>



    <div class="persona-description">

      <h3>
        Description
      </h3>


      <p>
        ${
          selectedPersona.description?.join("<br>") ||
          "No description available."
        }
      </p>


    </div>


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

  function calculateFusionLevel(personaA, personaB) {
    const fusionLevel = calculateFusionLevel(personaA, personaB);

    const fusionBonus = 3;

    return averageLevel + fusionBonus;
  }

  if (!result) {
    resultBox.innerHTML = `

    <div class="fusion-error">

      <h3>
        Fusion Tidak Tersedia
      </h3>

      <p>
        Kombinasi Persona ini belum memiliki
        hasil fusion.
      </p>

    </div>

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
    const currentDifference = Math.abs(persona.level - fusionLevel);

    const closestDifference = Math.abs(closest.level - fusionLevel);

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
      <span class="skill-badge">
        ${skill.name}
      </span>
    `;
  });

  resultBox.innerHTML = `

<div class="fusion-result-card">


  <h2>
    ${fusionPersona.name}
  </h2>


  <div class="fusion-meta">

    <span>
      Arcana:
      ${resultArcana}
    </span>


    <span>
      Level:
      ${fusionPersona.level}
    </span>

  </div>



  <h3>
    Skills
  </h3>


  <div class="skill-list">

    ${skillHTML || "<span>-</span>"}

  </div>


</div>

`;
}

function filterPersona(personas, keyword) {
  return personas.filter((persona) => {
    return persona.name.toLowerCase().includes(keyword.toLowerCase());
  });
}

function setupPersonaSearch(personas) {
  const searchInput = document.getElementById("persona-search");

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value;

    const filtered = filterPersona(personas, keyword);

    renderPersonaList(
      filterPersonas(
        personas,
        searchInput.value,
        document.getElementById("arcana-filter").value,
      ),
    );
  });
}

function setupArcanaFilter(personas, arcanas) {
  const select = document.getElementById("arcana-filter");

  if (!select) {
    return;
  }

  arcanas.forEach((arcana) => {
    select.innerHTML += `
      <option value="${arcana.id}">
        ${arcana.name}
      </option>
    `;
  });
}

function filterPersonas(personas, keyword, arcanaId) {
  return personas.filter((persona) => {
    const matchName = persona.name
      .toLowerCase()
      .includes(keyword.toLowerCase());

    const matchArcana =
      arcanaId === "all" || persona.arcanaId === Number(arcanaId);

    return matchName && matchArcana;
  });
}

function setupFilters(personas) {
  const searchInput = document.getElementById("persona-search");

  const arcanaSelect = document.getElementById("arcana-filter");

  const levelSort = document.getElementById("level-sort");

  if (!searchInput || !arcanaSelect || !levelSort) {
    return;
  }

  function updateList() {
    const filteredPersonas = filterPersonas(
      personas,
      searchInput.value,
      arcanaSelect.value,
    );

    const sortedPersonas = sortPersonas(filteredPersonas, levelSort.value);

    renderPersonaList(sortedPersonas);
  }

  searchInput.addEventListener("input", updateList);

  arcanaSelect.addEventListener("change", updateList);

  levelSort.addEventListener("change", updateList);
}

function updateList() {
  const filteredPersonas = filterPersonas(
    personas,
    searchInput.value,
    arcanaSelect.value,
  );

  const sortedPersonas = sortPersonas(filteredPersonas, levelSort.value);

  renderPersonaList(sortedPersonas);
}

function sortPersonas(personas, sortType) {
  const sorted = [...personas];

  if (sortType === "asc") {
    sorted.sort((a, b) => a.level - b.level);
  }

  if (sortType === "desc") {
    sorted.sort((a, b) => b.level - a.level);
  }

  return sorted;
}

const levelSort = document.getElementById("level-sort");

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

    renderPersonaSelector(
      personas,
      "search-persona-a",
      "persona-options-a",
      "persona-a",
    );

    renderPersonaSelector(
      personas,
      "search-persona-b",
      "persona-options-b",
      "persona-b",
    );

    function renderPersonaSelector(personas, searchId, optionsId, selectId) {
      const searchInput = document.getElementById(searchId);

      const optionsBox = document.getElementById(optionsId);

      const select = document.getElementById(selectId);

      if (!searchInput || !optionsBox || !select) {
        return;
      }

      function renderOptions(keyword = "") {
        const filtered = personas.filter((persona) =>
          persona.name.toLowerCase().includes(keyword.toLowerCase()),
        );

        optionsBox.innerHTML = "";

        filtered.forEach((persona) => {
          const option = document.createElement("div");

          option.className = "persona-option";

          option.innerHTML = `

        <strong>
          ${persona.name}
        </strong>

        <br>

        <small>
          Level ${persona.level}
        </small>

      `;

          option.addEventListener("click", () => {
            searchInput.value = persona.name;

            select.value = persona.id;

            optionsBox.innerHTML = "";
          });

          optionsBox.appendChild(option);
        });
      }

      searchInput.addEventListener("input", () => {
        renderOptions(searchInput.value);
      });

      renderOptions();
    }

    setupFusionButton(personas, skills, arcanas, fusionChart);

    setupFilters(personas);

    setupArcanaFilter(personas, arcanas);
  })
  .catch((error) => {
    console.error(error);
  });
