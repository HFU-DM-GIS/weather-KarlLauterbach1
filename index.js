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

  displayClothes(weather.current_weather.weathercode);
}
function displayClothes(weatherCode) {
  let clothingLink = generateClothingLink(weatherCode);
  let clothingLinkContainer = document.getElementById("clothing-link-container");
  clothingLinkContainer.innerHTML = `<a href="${clothingLink}" target="_blank"> Passendes Kleidungsstück ansehen</a>`;
}

function generateClothingLink(weatherCode) {
  // Füge hier die Logik hinzu, um den passenden Link basierend auf dem Wettercode zu generieren.
  // Zum Beispiel:
  if (weatherCode === 0) {
    return "https://www.zalando.de/damen/?q=sonnebrille";
  } else if (weatherCode === 1) {
    return "https://www.zalando.de/damen/?q=shorts";
  } else if (weatherCode === 2 ) {
    return "hhttps://www.zalando.de/damen/?q=strickjacke";
  } else if (weatherCode === 3) {
    return "https://www.zalando.de/damen/?q=leichte+jacke";
  } else if (weatherCode === 45) {
    return"https://www.zalando.de/damen/?q=windbreaker";
  } else if (weatherCode === 48) {
    return "https://www.zalando.de/damen/?q=windbreaker";
  } else if (weatherCode === 51) {
    return "https://www.zalando.de/damen/?q=regenjacke+leicht";
  } else if (weatherCode === 53) {
    return "https://www.zalando.de/damen/?q=regenjacke+leicht";
  } else if (weatherCode === 55) { 
    return "https://www.zalando.de/damen/?q=regenjacke+leicht";
  } else if (weatherCode === 56) {
    return "https://www.zalando.de/damen/?q=regenjacke";
  } else if (weatherCode === 57) { 
    return"https://www.zalando.de/damen/?q=regenjacke";
  } else if (weatherCode === 61) { 
    return "https://www.zalando.de/damen/?q=regenjacke+leicht";
  } else if (weatherCode === 63) { 
    return"https://www.zalando.de/damen/?q=dicke+regenjacke";
  } else if (weatherCode === 65) { 
    return"https://www.zalando.de/damen/?q=dicke+regenjacke";
  } else if (weatherCode === 66) {
    return"https://www.zalando.de/damen/?q=winterjacke";
  } else if (weatherCode === 67) {
    return"https://www.zalando.de/damen/?q=winterjacke";
  } else if (weatherCode === 71) {
    return"https://www.zalando.de/damen/?q=schneejacke";
  } else if (weatherCode === 73) { 
    return "https://www.zalando.de/damen/?q=schneejacke";
  } else if (weatherCode === 75) {
    return "https://www.zalando.de/damen/?q=schneejacke";
  } else if (weatherCode === 77) {
    return "https://www.zalando.de/damen/?q=schneejacke";
  } else if (weatherCode === 80) { 
    return "https://www.zalando.de/damen/?q=regenschirm";
  } else if (weatherCode === 81) {
    return "https://www.zalando.de/damen/?q=regenschirm";
  } else if (weatherCode === 82) { 
    return"https://www.zalando.de/damen/?q=gummistiefel";
  } else if (weatherCode === 85) { 
    return "https://www.zalando.de/damen/?q=wintermantel";
  } else if (weatherCode === 86) { 
    return"https://www.zalando.de/damen/?q=wintermantel";
  } else if (weatherCode === 95) { 
    return "https://www.zalando.de/damen/?q=gummistiefel";
  } else if (weatherCode === 96) {
    return "https://www.zalando.de/damen/?q=gummistiefel";
  } else if (weatherCode === 99) { 
    return "https://www.zalando.de/damen/?q=gummistiefel";
    };

  return "https://www.zalando.de/damen-home/";
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
    const weatherCodes = {
      0: "☀️ Clear", 
      1: "🌤️ Mainly clear",
      2: "⛅ Partly cloudy",
      3: "☁️ Overcast",
      45: "🌫️ Fog",
      48: "🌫️ Depositing rime fog",
      51: "🌧️ Light drizzle",
      53: "🌧️ Moderate drizzle",
      55: "🌧️ Dense drizzle",
      56: "🌧️❄️ Freezing Drizzle: Light intensity",
      57: "🌧️❄️ Freezing Drizzle: dense intensity",
      61: "🌧️ Slight rain",
      63: "🌧️ Moderate rain",
      65: "🌧️🌧️ Heavy rain",
      66: "🌧️❄️ Freezing Rain: Light intensity",
      67: "🌧️❄️ Freezing Rain: Heavy intensity",
      71: "❄️ Snow fall: Slight intensity",
      73: "❄️ Snow fall: Moderate intensity",
      75: "❄️❄️ Snow fall: Heavy intensity",
      77: "❄️ Snow grains",
      80: "🌦️ Slight rain showers",
      81: "🌦️ Moderate rain showers",
      82: "🌧️⛈️ Violent rain showers",
      85: "❄️ Slight snow showers",
      86: "❄️❄️ Heavy snow showers",
      95: "⛈️ Thunderstorm: Slight or moderate",
      96: "⛈️🌨️ Thunderstorm with slight hail",
      99: "⛈️🌨️ Thunderstorm with heavy hail",
 }
 const interpretation = weatherCodes[code];

  if (interpretation === undefined) {
    return "Unknown"; //Falls keine passende Interpretation gefunden wurde, 
    //wird "Unknown" zurückgegeben, ansonsten wird die ermittelte Interpretation zurückgegeben.
  } else {
    return interpretation; //Falls Interpretation gefunden worden ist, wird diese zurückgegeben 
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
   option.value = location

   option.text = location;
   list.add(option);
 });
}

function saveList() {
  if (foundLocation !== "" && !isLocationSaved(foundLocation)) {
    let option = document.createElement("option");
    option.value = foundLocation;
    option.text = foundLocation;
    list.add(option);
    saveLocation(foundLocation);
  }
}


function isLocationSaved(location) {
  let savedLocations = JSON.parse(localStorage.getItem("savedLocations")) || [];
  return savedLocations.includes(location);
}


function splitStringByComma(string) {
 return string.split(",").map((s) => s.trim());
}

function deleteLocation() {
  let selectedLocation = list.value;
  if (selectedLocation !== "Search for a city") {
    let savedLocations = JSON.parse(localStorage.getItem("savedLocations"));
    let index = savedLocations.indexOf(selectedLocation);
    if (index !== -1) {
      savedLocations.splice(index, 1);
      localStorage.setItem("savedLocations", JSON.stringify(savedLocations));
      list.remove(list.selectedIndex);
    }
  }
}
