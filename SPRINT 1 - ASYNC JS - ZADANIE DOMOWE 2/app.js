const BASE_API = "http://localhost:3000/characters";

const grid = document.getElementById("charactersGrid");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const deleteBtn = document.getElementById("deleteBtn");
const searchInput = document.getElementById("searchInput");
const radioStatus = document.querySelector(".radio");
const form = document.getElementById("addCharacterForm");
const name = document.getElementById("name");
const species = document.getElementById("species");

let currentPage = 1;
let currentSearch = "";
let currentStatus = "";

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  currentPage = 1;
  fetchCharacters();
});

radioStatus.addEventListener("change", handleStatus);

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchCharacters();
  }
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  fetchCharacters();
});

form.addEventListener("submit", addCharacter);

function handleStatus(event) {
  currentStatus = event.target.value;
  currentPage = 1;
  fetchCharacters();
}

function showNoResult() {
  grid.innerHTML = "";

  const resultMessage = document.createElement("p");
  resultMessage.className = "resultMessage";
  resultMessage.textContent =
    "Nie znaleziono postaci spełniających kryteria wyszukiwania.";

  grid.appendChild(resultMessage);
}

async function fetchCharacters() {
  let url = `${BASE_API}?_page=${currentPage}&_limit=5`;

  if (currentSearch) {
    url += `&name_like=${currentSearch}`;
  }

  if (currentStatus) {
    url += `&status=${currentStatus}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || data.length === 0) {
      showNoResult();
      return;
    }

    if (!response.ok) {
      throw new Error(`Błąd HTTP: ${response.status}`);
    }

    renderCharacters(data);
  } catch (error) {
    console.error(error);
  }
}

async function addCharacter(event) {
  event.preventDefault();

  const newCharacter = {
    name: name.value,
    status: status.value,
    species: species.value,
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  };

  try {
    await fetch(BASE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCharacter),
    });

    form.reset();
    fetchCharacters();
  } catch (error) {
    console.error(error);
  }
}

async function deleteCharacter(id) {
  try {
    await fetch(`${BASE_API}/${id}`, {
      method: "DELETE",
    });

    fetchCharacters();
  } catch (error) {
    console.error(error);
  }
}

function renderCharacters(characters) {
  grid.innerHTML = "";

  characters.forEach((character) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.className = "img";
    img.src = character.image;

    const charData = document.createElement("div");
    charData.className = "charData";

    const charName = document.createElement("span");
    charName.innerHTML = character.name;

    const status = document.createElement("p");
    status.innerHTML = `Status: ${character.status}`;

    const species = document.createElement("p");
    species.innerHTML = `Gatunek: ${character.species}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "Usuń postać";
    deleteBtn.className = "deleteBtn";
    deleteBtn.id = "deleteBtn";

    deleteBtn.addEventListener("click", () => {
      deleteCharacter(character.id);
    });

    charData.append(charName, status, species, deleteBtn);
    card.append(img, charData);
    grid.appendChild(card);
  });
}

fetchCharacters();
