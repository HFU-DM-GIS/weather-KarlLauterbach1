// original weather app from www.codewithrandom.com

const api = {
  baseOM: "https://api.open-meteo.com/v1/", // base URL for weather data
  baseGEO: "https://nominatim.openstreetmap.org/", // base URL for geocoding
};

let foundLocation = ""; //leerer String um Ort bzw Standort einzugeben
let foundCountry = ""; //Leerer String für Land

const searchbox = document.querySelector(".search-box"); //Konstante  mit dem namen searchbox, kann somit auf CSS Klasse hinzugefügt werden
searchbox.addEventListener("keypress", setQuery); // Methode addEventListener wird an Search Element gebunden--> wird ausgelöst wenn der Benutzer 
// die Taste drückt.
//Wenn das Ereignis ausgelöst wird, wird die Funktion setquery aufgerufen.
// Gesamter Codeauschnitt 11-12 ermöglicht auf HTML-Elemt zuzugreifen, um dann eine Funktion auszuführen, in diesem Fall Taste drücken.

const button = document.getElementById("refresh");
button.addEventListener("click", setQuery);
let buttonClicked = false;

button.onclick = function () {
  buttonClicked = true;
};

const save = document.getElementById("save");
save.addEventListener("click", saveLocation);

const list = document.getElementById("cityList");
loadSavedLocations();

function setQuery(evt) {
  if (evt.keyCode === 13 || buttonClicked === true) {
    getCoordinates(searchbox.value);
    buttonClicked = false;
  }
}

function saveLocation() {
  const location = searchbox.value;
  saveLocationToLocalStorage(location);
  appendLocationToList(location);
}

function saveLocationToLocalStorage(location) {
  const savedLocations = getSavedLocationsFromLocalStorage();
  savedLocations.push(location);
  localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
}

function getSavedLocationsFromLocalStorage() {
  const savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
  return savedLocations;
}

function loadSavedLocations() {
  const savedLocations = getSavedLocationsFromLocalStorage();
  for (let i = 0; i < savedLocations.length; i++) {
    const location = savedLocations[i];
    appendLocationToList(location);
  }
}

function appendLocationToList(location) {
  const opt = document.createElement("option");
  opt.value = location;
  opt.innerHTML = location;
  list.appendChild(opt);
}

function getResultsOM(coordinates) {
  fetch(
    `${api.baseOM}forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m&current_weather=true`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(displayResults)
    .catch((error) => {
      console.error("There was a problem fetching weather data:", error);
    });
}

function getCoordinates(query) {
  fetch(`${api.baseGEO}search?q=${query}&format=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const coordinates = {
        latitude: data[0].lat,
        longitude: data[0].lon,
      };
      const fullLocation = data[
