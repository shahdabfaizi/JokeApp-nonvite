let currentJoke = "";

async function joke() {
  try {
    const response = await fetch("https://witzapi.de/api/joke");
    const result = await response.json();
    const jokeText = result[0]?.text || "Kein Witz verfügbar";

    currentJoke = jokeText;

    const jokeElement = document.getElementById("jokeText");
    jokeElement.textContent = jokeText;
  } catch (error) {
    console.error("Fehler beim Abrufen des Witzes:", error);
  }
}

function generateId() {
  let lastId = parseInt(localStorage.getItem("lastId")) || 0;
  let newId = lastId + 1;
  localStorage.setItem("lastId", newId);
  return newId.toString();
}

function saveJoke() {
  if (currentJoke) {
    let savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];

    const isJokeAlreadySaved = savedJokes.some(
      (joke) => joke.text === currentJoke
    );

    if (!isJokeAlreadySaved) {
      const jokeWithId = {
        id: generateId(),
        text: currentJoke,
      };
      savedJokes.push(jokeWithId);
      localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
      displaySavedJokes();
    } else {
      console.log("Dieser Witz ist bereits gespeichert.");
    }
  } else {
    console.error("Kein Witz zum Speichern vorhanden.");
  }
}

function displaySavedJokes() {
  const savedJokesContainer = document.getElementById("savedJokesContainer");
  savedJokesContainer.innerHTML = "";

  const savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];

  savedJokes.forEach((joke) => {
    const jokeElement = document.createElement("div");
    jokeElement.className = "saved-joke";
    jokeElement.innerHTML = `
            <p>${joke.text}</p>
            <button class="button button--unsave" onclick="unsaveJoke('${joke.id}')">Unsave</button>
        `;
    savedJokesContainer.appendChild(jokeElement);
  });

  if (savedJokes.length === 0) {
    console.log("Keine Witze zum Anzeigen.");
  }
}

function unsaveJoke(id) {
  let savedJokes = JSON.parse(localStorage.getItem("savedJokes")) || [];

  const jokeIndex = savedJokes.findIndex((joke) => joke.id === id);

  if (jokeIndex > -1) {
    savedJokes.splice(jokeIndex, 1);
    localStorage.setItem("savedJokes", JSON.stringify(savedJokes));
    displaySavedJokes();
    console.log("Witz entfernt:", id);
  } else {
    console.error("Witz mit ID nicht gefunden:", id);
  }
}

window.onload = function () {
  displaySavedJokes();
};
