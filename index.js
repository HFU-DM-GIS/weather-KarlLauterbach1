// original weather app from www.codewithrandom.com

const api = {
  baseOM: "https://api.open-meteo.com/v1/", // base URL for weather data
  baseGEO: "https://nominatim.openstreetmap.org/", // base URL for geocoding
};

let foundLocation = "";
let foundCountry = "";

const searchbox = document.querySelector(".search-box");
searchbox.addEventListener("keypress", setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getCoordinates(searchbox.value);
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
  temp.innerHTML = `${Math.round(
    weather.current_weather.temperature/0.5
  )*0.5}<span>°C</span>`;
  
  let weather_el = document.querySelector(".current .weather");
  weather_el.innerText = interpretWeatherCode(
    weather.current_weather.weathercode
  );
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
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function splitStringByComma(str) {
  // Remove any leading/trailing whitespace from the string
  str = str.trim();

  // Split the string into an array using commas as the delimiter
  const substrings = str.split(",");

  // Trim any leading/trailing whitespace from each substring
  const trimmedSubstrings = substrings.map((substring) => substring.trim());

  return trimmedSubstrings;
}

function interpretWeatherCode(code) {
  // converting the weather codes from https://open-meteo.com/en/docs
  const weatherCodes = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Freezing Drizzle: Light intensity",
    57: "Freezing Drizzle: dense intensity",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing Rain: Light intensity",
    67: "Freezing Rain: Heavy intensity",
    71: "Snow fall: Slight intensity",
    73: "Snow fall: Moderate intensity",
    75: "Snow fall: Heavy intensity",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  const interpretation = weatherCodes[code];

  if (interpretation === undefined) {
    return "Unknown";
  } else {
    return interpretation;
  }
}
