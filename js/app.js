("use strict");

//HTML elements
const input = document.querySelector("#input");
const SearchBTN = document.querySelector("#search-btn");
const ClearBTN = document.querySelector("#clear-btn");
const errDiv = document.querySelector("#error-message");
const weatherData = document.querySelector("#weather-data");
const moreWeatherData = document.querySelector("#more-weather-data");

//API key
//skickas där vi kom överens om
const myKey = "";

//error message
let errMessage = document.createElement("p");
errMessage.classList.add("error-message");

//eventlisteners
SearchBTN.addEventListener("click", (e) => {
  e.preventDefault();
  let inputValue = input.value;

  moreWeatherData.innerHTML = "";
  errDiv.innerHTML = "";

  if (inputValue.trim() === "") {
    errMessage.innerHTML = "Kan ej vara tom!";
    errDiv.appendChild(errMessage);
    return false;
  } else {
    gettingWeatherData.getWeatherNow(inputValue);
  }
});

ClearBTN.addEventListener("click", (e) => {
  e.preventDefault();

  weatherData.innerHTML = "";
  moreWeatherData.innerHTML = "";
  errDiv.innerHTML = "";
  input.value = "";
});

//weather object
const gettingWeatherData = {
  //API call 1
  getWeatherNow(inputValue) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&lang=se&appid=${myKey}`;
    //calling "weather"

    this.callAPI(url).then((data) => {
      const icon = data.weather[0].icon;
      weatherData.innerHTML = `
    
    <div class="wrapper">
      <h2 id="main-headline">${data.name} (${data.sys.country}) </h2>
      <img src="http://openweathermap.org/img/w/${icon}.png" alt="vädericon" />
      <div>
          <h4 class="temp">${Math.round(data.main.temp)} °C</h4>
          <h4>Vind: ${Math.round(data.wind.speed)} m/s</h4>
          <h4>Känns som: ${Math.round(data.main.feels_like)} °C</h4>
      </div>
    </div>
        
    `;

      //more weather data push down
      const moreWeatherPushDown = document.createElement("div");
      moreWeatherPushDown.classList.add("more-weather-push-down");
      moreWeatherPushDown.innerHTML = "Mer &#9660";
      weatherData.append(moreWeatherPushDown);

      moreWeatherPushDown.addEventListener("click", () => {
        this.getMoreWeatherData(inputValue);
      });

      input.value = "";
    });
  },

  //API call 2
  getMoreWeatherData(inputValue) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&units=metric&lang=se&limit=5&appid=${myKey}`;
    //calling "forecast" instead of "weather"

    this.callAPI(url).then((data) => {
      const icon = data.list[6].weather[0].icon;

      moreWeatherData.innerHTML = `

    <div class="wrapper">
      <br>
      <h4>Beskrivning: ${data.list[0].weather[0].description}</h4>
      <h4>Vindbyar på upp till: ${data.list[0].wind.gust} m/s</h4>
      <h4>Lufttryck: ${data.list[0].main.pressure} hPa</h4>
      <h4>Luftfuktighet: ${data.list[0].main.humidity}%</h4>
      <h4>Sikt: ${data.list[0].visibility} m</h4>
      <br>
      <br>
      <hr class="divider">
      <div>
        <h3>Imorgon i ${inputValue}</h3>
        <h4>${data.list[6].dt_txt}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="vädericon">
        <h4 class="temp">${Math.round(data.list[6].main.temp)} °C</h4>
        <br>
      </div>
    </div>

    `;
    });
  },

  //method for calling APIs
  async callAPI(url) {
    try {
      let response = await fetch(url);
      if (!response.ok) throw new Error(response.status);

      let data = await response.json();
      return data;
    } catch (err) {
      errMessage.innerHTML = `Ett fel inträffade, försök igen! (${err})`;
      errDiv.appendChild(errMessage);
    }
  },
};
