// original weather app from www.codewithrandom.com

const api = {
  baseOM: "https://api.open-meteo.com/v1/", // base URL for weather data
  baseGEO: "https://nominatim.openstreetmap.org/", // base URL for geocoding
};

let foundLocation = ""; //leerer String um Ort bzw Standort einzugeben
let foundCountry = ""; //Leerer String für LAnd

const searchbox = document.querySelector(".search-box"); //Konstante  mit dem namen searchbox, kann somit auf CSS Klasse hinzugefügt werden
searchbox.addEventListener("keypress", setQuery);// Methode addEventListener wird an Search Element gebunden--> wird ausgelöst wenn der Benutzer 
// die Taste drückt.
//Wenn das Ereignis ausgelöst wird, wird die Funktion setquery aufgerufen.
// Gesamter Codeauschnitt 11-12 ermöglicht auf HTML-Elemt zuzugreifen, um dann eine Funktion auszuführen, in diesem Fall Taste drücken.

const button = document.getElementById("refresh");
button.addEventListener("click", setQuery);
let buttonClicked = false;

button.onclick = function (){
  buttonClicked = true
}
const save = document.getElementById("save");
save.addEventListener("click", saveList);
const list = document.getElementById("cityList");
function setQuery(evt) {
  if (evt.keyCode === 13 || buttonClicked === true) {
    getCoordinates(searchbox.value);
    buttonClicked = false;
  }
}

function getResultsOM(coordinates) { //als PArameter coodrinates
  fetch( //fetch sendet eine Anfrage an eine externe API
    `${api.baseOM}forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m&current_weather=true`
  ) //hier werden die coordinates Objekte von oben entnommen und in die API eingesetzt
    .then((response) => { //hier wird geprüft ob Server-Antwort passt und zurückgegeben wird
      if (!response.ok) { //hier prüft sie ob die Server-Antwort ok ist
        throw new Error("Network response was not ok"); //Falls dies nicht so ist, wird eine Fehlermeldung angezeigt.
      }
      return response.json();//Hier wird sie andernfalls in JSON Format umgewandelt und in dem nächsten then übergeben
    })
    .then(displayResults) //Funktion dispalyresults wird aufgerufen und übergibt die von der API zurückgegeben Daten als Parameter 
    .catch((error) => { //Wenn während der Fetch-PRozesses ein Fehler auftritt, wird catch aufgerufen und es kommt eine Fehlermeldung
      console.error("There was a problem fetching weather data:", error);//Diese Fehlermeldung wird ausgegeben.
    });
}

function getCoordinates(query) { //definiert die Funktion getCoordinates, die ebenfalls eine Suchanfrage an eine externe API sendet um Suchanfrage zu erhalten
  fetch(`${api.baseGEO}search?q=${query}&format=json`) 
    .then((response) => { //Response wird zurückgegeben, also die Server-Antwort--> Gleicher Prozess wie oben
      if (!response.ok) {
        throw new Error("Network response was not ok");//Falls dies nicht so ist, wird eine Fehlermeldung angezeigt.
      }
      return response.json(); //response wird zurückgegeben , wird aus json Objekt zurückgegeben 
    })
    .then((data) => { //GPS-Koordinaten werden aus dem Objekt extrahiert 
      const coordinates = {
        latitude: data[0].lat,//Daten werden mit den Eigenschaften latitude und longitude gespeichert, das aks Rückgabe der Koordinaten dient
        longitude: data[0].lon,
      };
      const fullLocation = data[0].display_name;
      const subLocationStrings = splitStringByComma(fullLocation); //wird auf den Ortsnamen angewendet um eine Liste von Strings zu erstellen.
      foundLocation = subLocationStrings[0]; //Erster Teil des Ortsnamen wird der Variable foundlocation zugewiesen 
      foundCountry = subLocationStrings[subLocationStrings.length - 1]; //Das Land wird der Variable foundcountry zugewiesen
      console.log(data);
      getResultsOM(coordinates); //Externe API wird wieder für Wetterdaten aufgerufen --> Wetterdaten werden abgerufen.
    })
    .catch((error) => {
      console.error("There was a problem fetching GPS coordinates:", error);
    });
    //dieser Abschnitt des Codes 43-64 bezieht sich auf das Abrufen des Wetters an einem bestimmten Ort.
}

function displayResults(weather) { //displayResults wird aufgerufen, wenn die Wetterdaten erfolgreich von der OpenWhatherAPI abgerufen worden ist
  console.log(weather);  //Wetter wird angezeigt in der Konsole          //HTML Elemente werden aktualisiert, um erhaltene Wettdertane zu aktualisieren.
  let city = document.querySelector(".location .city"); //HTML-Element wird augewählt mit Klassen location und city und speichert es in der Vaeiable City
  city.innerText = `${foundLocation}, ${foundCountry}`;

  let now = new Date(); //Es wird ein neues Date-Objekt erstellt mmit neuem Datum und wird gespeichert in der Variable now
  let date = document.querySelector(".location .date"); //Tag und Ort werden von dem HTML Element ausgewählt und gespeichert unter der Variable date
  date.innerText = dateBuilder(now); //Die Funktion setzt den Text des ausgewählten HTML-Elements auf das Datum, das von der Funktion dateBuilder unter Verwendung des now-Objekts erstellt wurde.

  let temp = document.querySelector(".current .temp"); // es wird die Klasse current und der Tag temp aus dem HTML-elemt ausgewählt und gespeichert
  temp.innerHTML = `${Math.round(
    weather.current_weather.temperature/0.5 //HTML-Inhalt aus dem Element wird auf gerundete Temperatur mit Celcius gekennzeichnet.
  )*0.5}<span>°C</span>`;
  
  let weather_el = document.querySelector(".current .weather"); //Klasee current und Tag wheater werden wieder ausgewählt und gespeichert
  weather_el.innerText = interpretWeatherCode(
    weather.current_weather.weathercode //<--Code ist darunter  gespeichert , wird interpretiert mithilfe der obigen Funktion.
  );
}
//Dieser Code-abschnitt 69-87 nimmt das Wetterobjekt das von der API erhalten worden ist, entpackt es und zeigt es auf der Webseite an.

function dateBuilder(d) { //Datum wird als Parameter erwartet
  let months = [ //Monate werden aufgelistet um datum zu erstellen
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
  let days = [ //Tage werden aufgelistet, um Datum zu erstellen 
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

  return `${day} ${date} ${month} ${year}`; //Datum wird als String wiedergegeben 
}

function splitStringByComma(str) { //String als Parameter 
  // Remove any leading/trailing whitespace from the string --> Eingabestring wird von Leerzeichen befreit
  str = str.trim();

  // Split the string into an array using commas as the delimiter
  const substrings = str.split(",");

  // Trim any leading/trailing whitespace from each substring
  const trimmedSubstrings = substrings.map((substring) => substring.trim());

  return trimmedSubstrings; //Der Array von Strings mit den bereinigten Unterzeichenketten wird zurückgegeben.
}

function interpretWeatherCode(code) { //in Objekt weatherCodes definiert, das als Schlüssel die Wettercodes und als Werte die dazugehörigen Interpretationen enthält.
  // converting the weather codes from https://open-meteo.com/en/docs
  const weatherCodes = { //mögliche Interpretationen
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
    return "Unknown"; //Falls keine passende Interpretation gefunden wurde, 
    //wird "Unknown" zurückgegeben, ansonsten wird die ermittelte Interpretation zurückgegeben.
  } else {
    return interpretation; //Falls Interpretation gefunden worden ist, wird diese zurückgegeben 
  }
}

function saveList(){
  var opt = document.createElement('option');
  opt.value = searchbox.value;
  opt.innerHTML = searchbox.value;
  list.appendChild(opt);
}
