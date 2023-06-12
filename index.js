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
save.addEventListener("click", saveList);

const list = document.getElementById("cityList");
function setQuery(evt) {
  if (evt.keyCode === 13 || buttonClicked === true) {
    getCoordinates(searchbox.value);
    buttonClicked = false;
  }
}

function saveLocation(location) {
  const savedLocations =
    JSON.parse(localStorage.getItem("savedLocations")) || [];
  savedLocations.push(location);
  localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
}

function loadSavedLocations() {
  const savedLocations =
    JSON.parse(localStorage.getItem("savedLocations")) || [];
  for (let i = 0; i < savedLocations.length; i++) {
    const opt = document.createElement("option");
    opt.value = savedLocations[i];
    opt.innerHTML = savedLocations[i];
    list.appendChild(opt);
  }
}

loadSavedLocations();

function saveList() {
  const location = searchbox.value;
  saveLocation(location);
  const opt = document.createElement("option");
  opt.value = location;
  opt.innerHTML = location;
  list.appendChild(opt);
}

function getResultsOM(coordinates) {
  //als PArameter coodrinates
  fetch(
    //fetch sendet eine Anfrage an eine externe API
    `${api.baseOM}forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m&current_weather=true`
  )
    //hier werden die coordinates Objekte von oben entnommen und in die API eingesetzt
    .then((response) => {
      //hier wird geprüft ob Server-Antwort passt und zurückgegeben wird
      if (!response.ok) {
        //hier prüft sie ob die Server-Antwort ok ist
        throw new Error("Network response was not ok"); //Falls dies nicht so ist, wird eine Fehlermeldung angezeigt.
      }
      return response.json(); //Hier wird sie andernfalls in JSON Format umgewandelt und in dem nächsten then übergeben
    })
    .then(displayResults) //Funktion dispalyresults wird aufgerufen und übergibt die von der API zurückgegeben Daten als Parameter
    .catch((error) => {
      //Wenn während der Fetch
