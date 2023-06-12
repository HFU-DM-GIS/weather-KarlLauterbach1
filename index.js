// original weather app from www.codewithrandom.com

const api = {
  baseOM: "https://api.open-meteo.com/v1/",
  baseGEO: "https://nominatim.openstreetmap.org/",
};

let foundLocation = "";
let foundCountry = "";

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

const button = document.getElementById("refresh");
button.addEventListener("click", setQuery);
let buttonClicked = false;

button.onclick = function () {
  buttonClicked = true;
};

const save = document.getElementById("save");
save.addEventListener("click", saveList);
const list = document.getElementById("cityList");

list.addEventListener("change", function () {
  searchbox.value = list.value;
});

document.addEventListener("DOMContentLoaded", function () {
  loadSavedLocations();
});

function setQuery(evt) {
  if (evt.keyCode === 13 || buttonClicked === true) {
    getCoordinates(searchbox.value);
    buttonClicked = false;
  }
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
      const fullLocation = data[0].display_name;
      const subLocationStrings = splitStringByComma(fullLocation);
      foundLocation = subLocationStrings[0];
      foundCountry = subLocationStrings[subLocationStrings.length - 1];
      console.log(data);
      getResultsOM(coordinates);
      saveLocation(query); // Speichern Sie den ausgewählten Ort im Local Storage
    })
    .catch((error) => {
      console.error("There was a problem fetching GPS coordinates:", error);
    });
}

function displayResults(weather) {
  console.log(weather);
  let city = document.querySelector(".location .city");
  city.innerText = `${foundLocation}, ${foundCountry}`;

  let now = new Date();
  let date = document.querySelector(".location .date");
  date.innerText = dateBuilder(now);

  let temp = document.querySelector(".current .temp");
  temp.innerHTML = `${Math.round(weather.current_weather.temperature / 0.5) * 0.5}<span>°C</span>`;

  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = interpretWeatherCode(weather.current_weather.weathercode);
}

function dateBuilder(d) {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
 
 let date = String(d.getDate()).padStart(2, "0");
 let month = months[d.getMonth()];
 let year = d.getFullYear();

 return `${date} ${month} ${year}`;
}

function interpretWeatherCode(code) {
 // Hier kannst du deine eigene Logik für die Interpretation der Wettercodes implementieren
 // Ich verwende hier nur einige Beispiele
 if (code >= 200 && code <= 232) {
   return "Thunderstorm";
 } else if (code >= 300 && code <= 321) {
   return "Drizzle";
 } else if (code >= 500 && code <= 531) {
   return "Rain";
 } else if (code >= 600 && code <= 622) {
   return "Snow";
 } else if (code >= 701 && code <= 781) {
   return "Mist";
 } else if (code === 800) {
   return "Clear";
 } else if (code >= 801 && code <= 804) {
   return "Clouds";
 } else {
   return "Unknown";
 }
}

function saveLocation(location) {
 let savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
 savedLocations.push(location);
 localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
}

function loadSavedLocations() {
 let savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
 savedLocations.forEach((location) => {
   let option = document.createElement("option");
   option.value = location;
   option.text = location;
   list.add(option);
 });
}

function saveList() {
 let selectedLocation = searchbox.value;
 let option = document.createElement("option");
 option.value = selectedLocation;
 option.text = selectedLocation;
 list.add(option);
 saveLocation(selectedLocation);
}

function splitStringByComma(string) {
 return string.split(",").map((s) => s.trim());
}
