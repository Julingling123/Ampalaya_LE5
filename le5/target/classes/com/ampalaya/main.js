
document.getElementById('city').addEventListener('input', function () {
    var city = this.value;
    getWeather(city);
  });
  
  async function getWeather() {
    try {
        var city = document.getElementById('city').value;
        console.log('Şəhər adı:', city);
  
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                q: city,
                appid: '54a57bc234ad752a4f59e59cd372201d',
                units: 'metric'
            },
        });
        const currentTemperature = response.data.list[0].main.temp;
  
        document.querySelector('.weather-temp').textContent = Math.round(currentTemperature) + 'ºC';
  
        const forecastData = response.data.list;
  
        const dailyForecast = {};
        forecastData.forEach((data) => {
            const day = new Date(data.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
            if (!dailyForecast[day]) {
                dailyForecast[day] = {
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: data.weather[0].icon,
  
  
                };
            } else {
                dailyForecast[day].minTemp = Math.min(dailyForecast[day].minTemp, data.main.temp_min);
                dailyForecast[day].maxTemp = Math.max(dailyForecast[day].maxTemp, data.main.temp_max);
            }
        });
  
        document.querySelector('.date-dayname').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
        const date = new Date().toUTCString();
        const extractedDateTime = date.slice(5, 16);
        document.querySelector('.date-day').textContent = extractedDateTime.toLocaleString('en-US');
  
        const currentWeatherIconCode = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].icon;
        const weatherIconElement = document.querySelector('.weather-icon');
        weatherIconElement.innerHTML = getWeatherIcon(currentWeatherIconCode);
  
        document.querySelector('.location').textContent = response.data.city.name;
        document.querySelector('.weather-desc').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
        document.querySelector('.humidity .value').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].humidity + ' %';
        document.querySelector('.wind .value').textContent = dailyForecast[new Date().toLocaleDateString('en-US', { weekday: 'long' })].windSpeed + ' m/s';
  
  
        const dayElements = document.querySelectorAll('.day-name');
        const tempElements = document.querySelectorAll('.day-temp');
        const iconElements = document.querySelectorAll('.day-icon');
  
        dayElements.forEach((dayElement, index) => {
            const day = Object.keys(dailyForecast)[index];
            const data = dailyForecast[day];
            dayElement.textContent = day;
            tempElements[index].textContent = `${Math.round(data.minTemp)}º / ${Math.round(data.maxTemp)}º`;
            iconElements[index].innerHTML = getWeatherIcon(data.icon);
        });
  
    } catch (error) {
        console.error('Məlumat alınarkən səhv baş verdi:', error.message);
    }
  }
  
  function getWeatherIcon(iconCode) {
    const iconBaseUrl = 'https://openweathermap.org/img/wn/';
    const iconSize = '@2x.png';
    return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
  }

// Function to initialize the map
function initMap(location) {
    const map = L.map('map').setView(location, 13); // Set initial view to the location

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the location
    L.marker(location).addTo(map);
}

// Function to update the map based on user input
document.querySelector('.location-input').addEventListener('change', function() {
    const city = this.value;
    // Use geocoding API to convert city name to coordinates (latitude and longitude)
    axios.get(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`)
        .then(response => {
            if (response.data.length > 0) {
                const location = [response.data[0].lat, response.data[0].lon];
                initMap(location); // Initialize the map with the new location
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
});

// Initialize with default location
initMap([40.7128, -74.0060]); // New York City by default
  
  
  document.addEventListener("DOMContentLoaded", function () {
    getWeather();
    setInterval(getWeather, 900000);
  });

  // Replace this with your actual OpenWeatherMap API key
const OPENWEATHER_API_KEY = '54a57bc234ad752a4f59e59cd372201d';

// Initialize the map variable globally to allow updates
let map;
let marker;

// Function to initialize the map with given latitude and longitude
function initMap(lat, lon) {
    // If map is already initialized, just set the view and move the marker
    if (map) {
        map.setView([lat, lon], 13);
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            marker = L.marker([lat, lon]).addTo(map);
        }
        return;
    }

    // Initialize the map if not already initialized
    map = L.map('map').setView([lat, lon], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker for the location
    marker = L.marker([lat, lon]).addTo(map);
}

// Function to get weather data based on latitude and longitude
async function getWeather(lat, lon) {
    try {
        console.log('Fetching weather for coordinates:', lat, lon);

        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: lat,
                lon: lon,
                appid: OPENWEATHER_API_KEY,
                units: 'metric'
            },
        });

        const currentTemperature = response.data.list[0].main.temp;

        document.querySelector('.weather-temp').textContent = Math.round(currentTemperature) + 'ºC';

        const forecastData = response.data.list;

        const dailyForecast = {};
        forecastData.forEach((data) => {
            const date = new Date(data.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            if (!dailyForecast[day]) {
                dailyForecast[day] = {
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    description: data.weather[0].description,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon: data.weather[0].icon,
                };
            } else {
                dailyForecast[day].minTemp = Math.min(dailyForecast[day].minTemp, data.main.temp_min);
                dailyForecast[day].maxTemp = Math.max(dailyForecast[day].maxTemp, data.main.temp_max);
            }
        });

        // Update Date Information
        const today = new Date();
        document.querySelector('.date-dayname').textContent = today.toLocaleDateString('en-US', { weekday: 'long' });
        document.querySelector('.date-day').textContent = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // Update Weather Icon
        const currentWeatherIconCode = response.data.list[0].weather[0].icon;
        const weatherIconElement = document.querySelector('.weather-icon');
        weatherIconElement.innerHTML = getWeatherIcon(currentWeatherIconCode);

        // Update Location Name
        document.querySelector('.location').textContent = response.data.city.name;

        // Update Weather Description
        document.querySelector('.weather-desc').textContent = response.data.list[0].weather[0].description
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Update Humidity and Wind
        document.querySelector('.humidity .value').textContent = response.data.list[0].main.humidity + ' %';
        document.querySelector('.wind .value').textContent = response.data.list[0].wind.speed + ' m/s';

        // Update Weekly Forecast
        updateWeeklyForecast(dailyForecast);

    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        alert('Unable to fetch weather data. Please try again later.');
    }
}

// Function to update the weekly forecast
function updateWeeklyForecast(dailyForecast) {
    const weekList = document.querySelector('.week-list');

    // Clear existing forecast items
    weekList.innerHTML = ''; // Clear all existing forecast items

    // Limit to next 4 days for example
    const days = Object.keys(dailyForecast).slice(0, 4);

    days.forEach(day => {
        const data = dailyForecast[day];

        // Create a new list item
        const li = document.createElement('li');

        const dayName = document.createElement('span');
        dayName.className = 'day-name';
        dayName.textContent = day;

        const dayTemp = document.createElement('span');
        dayTemp.className = 'day-temp';
        dayTemp.textContent = `${Math.round(data.minTemp)}º / ${Math.round(data.maxTemp)}º`;

        const dayIcon = document.createElement('span');
        dayIcon.className = 'day-icon';
        dayIcon.innerHTML = getWeatherIcon(data.icon);

        // Append elements to li
        li.appendChild(dayName);
        li.appendChild(dayTemp);
        li.appendChild(dayIcon);

        // Append li to weekList
        weekList.appendChild(li);
    });

    // Add a clear div if necessary
    const clearDiv = document.createElement('div');
    clearDiv.className = 'clear';
    weekList.appendChild(clearDiv);
}

// Function to get weather icon HTML
function getWeatherIcon(iconCode) {
    const iconBaseUrl = 'https://openweathermap.org/img/wn/';
    const iconSize = '@2x.png';
    return `<img src="${iconBaseUrl}${iconCode}${iconSize}" alt="Weather Icon">`;
}

// Function to handle location input and update map & weather
async function handleLocationInput(city) {
    if (!city) return;

    try {
        // Use Geocoding API to convert city name to coordinates
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: city,
                format: 'json',
                limit: 1
            }
        });

        if (response.data.length > 0) {
            const lat = parseFloat(response.data[0].lat);
            const lon = parseFloat(response.data[0].lon);
            initMap(lat, lon); // Update the map with the new location
            getWeather(lat, lon); // Fetch weather for the new location
        } else {
            alert('Location not found. Please try another city.');
        }
    } catch (error) {
        console.error('Error fetching location data:', error);
        alert('Unable to fetch location data. Please try again later.');
    }
}

// Event listener for the search button
document.getElementById('search-btn').addEventListener('click', function () {
    const cityInput = document.getElementById('city').value.trim();
    if (cityInput.length === 0) {
        alert('Please enter a city name.');
        return;
    }
    handleLocationInput(cityInput);
});

// Allow pressing Enter key to trigger the search
document.getElementById('city').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent form submission if inside a form
        document.getElementById('search-btn').click();
    }
});

// Function to initialize the application
function initializeApp() {
    // Check if Geolocation is supported
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                initMap(lat, lon);
                getWeather(lat, lon);
                // Optionally, update the input field with the detected city
                reverseGeocode(lat, lon);
            },
            (error) => {
                console.error('Error getting geolocation:', error.message);
                alert('Unable to retrieve your location. Showing weather for New York by default.');
                // Fallback to default location (New York)
                const defaultLat = 40.7128;
                const defaultLon = -74.0060;
                initMap(defaultLat, defaultLon);
                getWeather(defaultLat, defaultLon);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Showing weather for New York by default.');
        // Fallback to default location (New York)
        const defaultLat = 40.7128;
        const defaultLon = -74.0060;
        initMap(defaultLat, defaultLon);
        getWeather(defaultLat, defaultLon);
    }

    // Set interval to refresh weather data every 15 minutes
    setInterval(() => {
        if (map && map.getCenter()) {
            const center = map.getCenter();
            getWeather(center.lat, center.lng);
        }
    }, 900000); // 900,000 ms = 15 minutes
}

// Optional: Function to reverse geocode coordinates to city name
async function reverseGeocode(lat, lon) {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat: lat,
                lon: lon,
                format: 'json',
            }
        });

        if (response.data && response.data.address) {
            const city = response.data.address.city || response.data.address.town || response.data.address.village || '';
            if (city) {
                document.getElementById('city').value = city;
            }
        }
    } catch (error) {
        console.error('Error reverse geocoding:', error);
    }
}

// Initialize the application once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeApp);
