const locationInput = document.getElementById('location-input');
const submitButton = document.querySelector('button');
const weatherDiv = document.querySelector('.weather-info');
const tempToggle = document.getElementById('toggle');
const weatherGifDiv = document.querySelector('.weather-gif-container');

submitButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        const weatherJSONPromise = getWeatherInfo(location)
                                    .then(processWeatherJSON);
        weatherJSONPromise
        .then(displayWeatherInfo);

        weatherJSONPromise
        .then(getWeatherGif)
        .then(displayWeatherGif);
    }
});

const WEATHER_API_KEY = '61847929774a4b95b1c94052240503';
const GIPGY_API_KEY = 'lZ2Xmj4Rg6HREtp1jshZ2QZE34ei9MZ8';

function getWeatherInfo(location) {
    const baseURL = 'https://api.weatherapi.com/v1';
    const endpoint = '/current.json';
    const URL = baseURL + endpoint + '?key=' + WEATHER_API_KEY + '&q=' + location;
    
    return fetch(URL)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        console.log(json);
        return json;
    })
    .catch(function(err) {
        console.log(err);
    });
}

function processWeatherJSON(weatherJSON) {
    return {
        name: weatherJSON.location.name,
        region: weatherJSON.location.region,
        country: weatherJSON.location.country,
        condition: weatherJSON.current.condition.text,
        temp_c: weatherJSON.current.temp_c,
        temp_f: weatherJSON.current.temp_f,
        feelslike_c: weatherJSON.current.feelslike_c,
        feelslike_f: weatherJSON.current.feelslike_f,
        humidity: weatherJSON.current.humidity,
        uv: weatherJSON.current.uv,
    };
}

function displayWeatherInfo(weatherInfo) {
    console.log(weatherInfo);
    weatherDiv.textContent = '';

    const tempOption = (tempToggle.checked)? 'C': 'F';
    
    for (const key of Object.keys(weatherInfo)) {
        if ((tempOption === 'C' && (key === 'temp_f' || key === 'feelslike_f')) 
            || (tempOption === 'F' && (key === 'temp_c' || key === 'feelslike_c'))) continue;
        
        const p = document.createElement('p');
        let value = weatherInfo[key];
        p.textContent = `${key.toLocaleUpperCase()}: ${value}`;
        weatherDiv.appendChild(p);
    }

    return weatherInfo;
}

async function getWeatherGif(weatherInfo) {
    const weatherDescription = `${weatherInfo.condition} Weather`;

    const baseURL = 'https://api.giphy.com/v1/gifs'
    const endpoint = '/translate';
    const URL = baseURL + endpoint + '?api_key=' + GIPGY_API_KEY + '&s=' + weatherDescription;

    const response = await fetch(URL);
    const json = await response.json();

    return json.data.images.original.url;
}

function displayWeatherGif(gifURL) {
    weatherGifDiv.textContent = '';

    const img = document.createElement('img');
    img.classList.add('weather-gif');
    img.src = gifURL;
    img.alt = 'Gif showing weather of the Location';
    img.style.maxWidth = weatherGifDiv.width;

    weatherGifDiv.appendChild(img);
}