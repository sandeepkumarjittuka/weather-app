const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weather-card");
const loader = document.getElementById("loader");

const API_KEY = "830fa601674febcd005a3337e175d5fd"; // Replace with your OpenWeatherMap API key

let currentWeatherData = null;
let isCelsius = true;

// Format Time
function formatTime(timestamp) {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Format Date
function getCurrentDate() {
    return new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });
}

// Fetch Weather
async function getWeather(city) {

    try {

        loader.style.display = "block";
        weatherCard.innerHTML = "";

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        currentWeatherData = data;

        localStorage.setItem("lastCity", city);

        renderWeather(data);

        setBackground(data.weather[0].main);

    } catch (error) {

        weatherCard.innerHTML = `
            <h2>❌ City Not Found</h2>
        `;

        console.error(error);

    } finally {

        loader.style.display = "none";
    }
}

// Render UI
function renderWeather(data) {

    let temp = data.main.temp;

    if (!isCelsius) {
        temp = (temp * 9 / 5) + 32;
    }

    const icon = data.weather[0].icon;

    weatherCard.innerHTML = `
    
        <div class="weather-header">

            <p class="date">
                ${getCurrentDate()}
            </p>

            <h2>
                ${data.name}, ${data.sys.country}
            </h2>

            <img
                src="https://openweathermap.org/img/wn/${icon}@4x.png"
                alt="Weather Icon"
            >

            <h1>
                ${Math.round(temp)}°
                ${isCelsius ? "C" : "F"}
            </h1>

            <p class="description">
                ${data.weather[0].description}
            </p>

            <button id="toggleTemp">
                Switch to ${isCelsius ? "°F" : "°C"}
            </button>

        </div>

        <div class="weather-stats">

            <div class="stat-card">
                <h3>💧</h3>
                <p>${data.main.humidity}%</p>
                <span>Humidity</span>
            </div>

            <div class="stat-card">
                <h3>🌬️</h3>
                <p>${data.wind.speed}</p>
                <span>Wind</span>
            </div>

            <div class="stat-card">
                <h3>🌡️</h3>
                <p>${Math.round(data.main.feels_like)}°</p>
                <span>Feels Like</span>
            </div>

        </div>

        <div class="sun-section">

            <div class="sun-card">
                🌅 Sunrise
                <br>
                ${formatTime(data.sys.sunrise)}
            </div>

            <div class="sun-card">
                🌇 Sunset
                <br>
                ${formatTime(data.sys.sunset)}
            </div>

        </div>
    `;

    document
        .getElementById("toggleTemp")
        .addEventListener("click", () => {

            isCelsius = !isCelsius;

            renderWeather(currentWeatherData);
        });
}

// Dynamic Background
function setBackground(weather) {

    switch (weather.toLowerCase()) {

        case "clear":
            document.body.style.background =
                "linear-gradient(135deg,#56ccf2,#2f80ed)";
            break;

        case "clouds":
            document.body.style.background =
                "linear-gradient(135deg,#bdc3c7,#2c3e50)";
            break;

        case "rain":
            document.body.style.background =
                "linear-gradient(135deg,#4b79a1,#283e51)";
            break;

        case "thunderstorm":
            document.body.style.background =
                "linear-gradient(135deg,#232526,#414345)";
            break;

        default:
            document.body.style.background =
                "linear-gradient(135deg,#74ebd5,#acb6e5)";
    }
}

// Search Button
searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }
});

// Enter Key
cityInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        const city = cityInput.value.trim();

        if (city) {
            getWeather(city);
        }
    }
});

// Load Last City
window.addEventListener("load", () => {

    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        getWeather(lastCity);
    }
});