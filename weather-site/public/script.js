//variable declaration. Fetches these variables from the html file by their unique id
const userLocation = document.getElementById("userLocation");
const converter = document.getElementById("converter");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const cloudsValue = document.getElementById("cloudsValue");
const uvIndex = document.getElementById("uvIndex");
const pressureValue = document.getElementById("pressureValue");
const forecastContainer = document.getElementById("forecast");

//function to fetch and display the current weather data
function findUserLocation() {
  //Gets and cleans user input(city name)
  const cityName = userLocation.value.trim();

  //if input is empty, alert the user
  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }

  // Calls our own backend, which adds the API key server-side
  fetch(`/api/weather?q=${encodeURIComponent(cityName)}`)
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        alert("City not found");
        return;
      }

      //Updates the website with the fetched weather data
      temperature.textContent = `${data.main.temp}°C`;
      feelslike.textContent = `Feels like: ${data.main.feels_like}°C`;
      description.textContent = data.weather[0].description;
      city.textContent = data.name;
      humidityValue.textContent = `${data.main.humidity}%`;
      windValue.textContent = `${data.wind.speed} m/s`;
      cloudsValue.textContent = `${data.clouds.all}%`;
      pressureValue.textContent = `${data.main.pressure} hPa`;
      date.textContent = new Date().toLocaleString();

      // Call forecast function to fetch and display the 5-day forecast
      getForecast(cityName);
    })
    .catch((error) => {
      console.error("Error fetching current weather:", error);
    });
}

// Function to fetch and display 5-day forecast data
function getForecast(cityName) {
  fetch(`/api/forecast?q=${encodeURIComponent(cityName)}`)
    .then((res) => res.json())
    .then((data) => {
      // Clear existing forecast data
      forecastContainer.innerHTML = "";

      const dailyData = {};

      // Loop through all forecast entries
      data.list.forEach((entry) => {
        const day = entry.dt_txt.split(" ")[0];
        const hour = parseInt(entry.dt_txt.split(" ")[1].split(":")[0]);

        if (hour === 12 && !dailyData[day]) {
          dailyData[day] = entry;
        }
      });

      Object.keys(dailyData).forEach((dayKey) => {
        const forecast = dailyData[dayKey];
        const day = new Date(dayKey).toLocaleDateString("en-KE", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        //Weather-icons are fetched from here
        const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        card.innerHTML = `
          <h4>${day}</h4>
          <img src="${iconUrl}" alt="${forecast.weather[0].description}" />
          <p>${forecast.main.temp}°C</p>
          <p>${forecast.weather[0].description}</p>
        `;

        forecastContainer.appendChild(card);
      });
    })
    .catch((error) => {
      //Handle and log errors
      console.error("Error fetching forecast:", error);
    });
}