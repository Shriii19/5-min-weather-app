// Vibe Weather Dashboard - Main JavaScript File
// Author: Vibe Coded
// Description: Modern weather dashboard with real-time data from WeatherAPI.com

// ================================
// CONFIGURATION & CONSTANTS
// ================================

const API_KEY = 'cfba6f4ffa5343c3a06165601252607'; // WeatherAPI.com API key
const BASE_URL = 'https://api.weatherapi.com/v1';
const DEFAULT_CITY = 'New York';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const DEBOUNCE_DELAY = 300; // 300ms for search input

// Weather condition mappings for dynamic backgrounds
const WEATHER_BACKGROUNDS = {
    'clear': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'cloudy': 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
    'rain': 'linear-gradient(135deg, #4B79A1 0%, #283E51 100%)',
    'snow': 'linear-gradient(135deg, #E0EAFC 0%, #CFDEF3 100%)',
    'storm': 'linear-gradient(135deg, #2C3E50 0%, #4A6741 100%)'
};

// ================================
// STATE MANAGEMENT
// ================================

const weatherState = {
    currentUnit: 'C',
    currentLocation: null,
    weatherData: null,
    isLoading: false,
    lastUpdated: null
};

// ================================
// DOM ELEMENTS
// ================================

const elements = {
    // Input elements
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    
    // Display containers
    loading: document.getElementById('loading'),
    weatherDisplay: document.getElementById('weatherDisplay'),
    errorState: document.getElementById('errorState'),
    retryBtn: document.getElementById('retryBtn'),
    
    // Weather information
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    weatherIcon: document.getElementById('weatherIcon'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    feelsLike: document.getElementById('feelsLike'),
    
    // Weather stats
    visibility: document.getElementById('visibility'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    
    // Forecast containers
    forecastContainer: document.getElementById('forecastContainer'),
    hourlyContainer: document.getElementById('hourlyContainer'),
    
    // Unit toggle buttons
    unitButtons: document.querySelectorAll('.unit-btn'),
    
    // Main container for background changes
    weatherContainer: document.getElementById('weatherContainer')
};

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Debounce function to limit API calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format date to readable string
 */
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time to 12-hour format
 */
function formatTime(timeString) {
    const time = new Date(`2000-01-01 ${timeString}`);
    return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        hour12: true 
    });
}

/**
 * Get day name from date string
 */
function getDayName(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Convert temperature based on current unit
 */
function convertTemperature(tempC, unit = weatherState.currentUnit) {
    if (unit === 'F') {
        return Math.round((tempC * 9/5) + 32);
    }
    return Math.round(tempC);
}

/**
 * Get temperature unit symbol
 */
function getUnitSymbol() {
    return weatherState.currentUnit === 'F' ? '°F' : '°C';
}

/**
 * Show loading state
 */
function showLoading() {
    weatherState.isLoading = true;
    elements.loading.style.display = 'flex';
    elements.weatherDisplay.style.display = 'none';
    elements.errorState.style.display = 'none';
}

/**
 * Show weather data
 */
function showWeatherData() {
    weatherState.isLoading = false;
    elements.loading.style.display = 'none';
    elements.weatherDisplay.style.display = 'block';
    elements.errorState.style.display = 'none';
}

/**
 * Show error state
 */
function showError(message = 'Unable to fetch weather data. Please try again.') {
    weatherState.isLoading = false;
    elements.loading.style.display = 'none';
    elements.weatherDisplay.style.display = 'none';
    elements.errorState.style.display = 'block';
    
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

/**
 * Update background based on weather condition
 */
function updateBackground(condition) {
    const conditionLower = condition.toLowerCase();
    let gradient = WEATHER_BACKGROUNDS.clear; // default
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        gradient = WEATHER_BACKGROUNDS.rain;
    } else if (conditionLower.includes('snow') || conditionLower.includes('blizzard')) {
        gradient = WEATHER_BACKGROUNDS.snow;
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
        gradient = WEATHER_BACKGROUNDS.cloudy;
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
        gradient = WEATHER_BACKGROUNDS.storm;
    }
    
    elements.weatherContainer.style.background = gradient;
}

// ================================
// API FUNCTIONS
// ================================

/**
 * Fetch weather data from API
 */
async function fetchWeatherData(query) {
    try {
        const response = await fetch(
            `${BASE_URL}/forecast.json?key=${API_KEY}&q=${query}&days=5&aqi=yes&alerts=yes`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

/**
 * Get weather data for a specific location
 */
async function getWeatherData(query) {
    try {
        showLoading();
        
        const data = await fetchWeatherData(query);
        weatherState.weatherData = data;
        weatherState.currentLocation = query;
        weatherState.lastUpdated = new Date();
        
        displayCurrentWeather(data);
        displayWeatherStats(data);
        displayForecast(data.forecast.forecastday);
        displayHourlyForecast(data.forecast.forecastday[0].hour);
        
        showWeatherData();
        updateBackground(data.current.condition.text);
        
    } catch (error) {
        console.error('Error getting weather data:', error);
        showError(getErrorMessage(error));
    }
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error) {
    if (error.message.includes('No matching location found')) {
        return 'Location not found. Please check the city name and try again.';
    } else if (error.message.includes('API key')) {
        return 'Invalid API key. Please check your WeatherAPI.com configuration.';
    } else if (error.message.includes('403')) {
        return 'API quota exceeded. Please check your WeatherAPI.com plan.';
    } else if (error.message.includes('Network')) {
        return 'Network error. Please check your internet connection.';
    }
    return 'Unable to fetch weather data. Please try again later.';
}

// ================================
// DISPLAY FUNCTIONS
// ================================

/**
 * Display current weather information
 */
function displayCurrentWeather(data) {
    const { current, location } = data;
    
    // Location and date
    elements.cityName.textContent = `${location.name}, ${location.country}`;
    elements.currentDate.textContent = formatDate(new Date());
    
    // Weather icon
    elements.weatherIcon.src = `https:${current.condition.icon}`;
    elements.weatherIcon.alt = current.condition.text;
    
    // Temperature
    const temp = convertTemperature(current.temp_c);
    const feelsLike = convertTemperature(current.feelslike_c);
    elements.temperature.textContent = `${temp}°`;
    elements.feelsLike.textContent = `Feels like ${feelsLike}${getUnitSymbol()}`;
    
    // Description
    elements.description.textContent = current.condition.text;
}

/**
 * Display weather statistics
 */
function displayWeatherStats(data) {
    const { current } = data;
    
    elements.visibility.textContent = `${current.vis_km} km`;
    elements.humidity.textContent = `${current.humidity}%`;
    elements.windSpeed.textContent = `${current.wind_kph} km/h`;
    elements.pressure.textContent = `${current.pressure_mb} hPa`;
}

/**
 * Display 5-day forecast
 */
function displayForecast(forecastDays) {
    elements.forecastContainer.innerHTML = '';
    
    forecastDays.forEach((day, index) => {
        const forecastCard = createForecastCard(day, index === 0);
        elements.forecastContainer.appendChild(forecastCard);
    });
}

/**
 * Create forecast card element
 */
function createForecastCard(dayData, isToday = false) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const dayName = isToday ? 'Today' : getDayName(dayData.date);
    const maxTemp = convertTemperature(dayData.day.maxtemp_c);
    const minTemp = convertTemperature(dayData.day.mintemp_c);
    const unitSymbol = getUnitSymbol();
    
    card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <img class="forecast-icon" src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}">
        <div class="forecast-temps">
            <span class="temp-high">${maxTemp}${unitSymbol}</span>
            <span class="temp-low">${minTemp}${unitSymbol}</span>
        </div>
        <div class="forecast-desc">${dayData.day.condition.text}</div>
    `;
    
    return card;
}

/**
 * Display hourly forecast
 */
function displayHourlyForecast(hourlyData) {
    elements.hourlyContainer.innerHTML = '';
    
    // Show next 24 hours starting from current time
    const currentHour = new Date().getHours();
    const hoursToShow = hourlyData.slice(currentHour, currentHour + 12);
    
    hoursToShow.forEach(hour => {
        const hourlyCard = createHourlyCard(hour);
        elements.hourlyContainer.appendChild(hourlyCard);
    });
}

/**
 * Create hourly forecast card
 */
function createHourlyCard(hourData) {
    const card = document.createElement('div');
    card.className = 'hourly-card';
    
    const time = formatTime(hourData.time.split(' ')[1]);
    const temp = convertTemperature(hourData.temp_c);
    const unitSymbol = getUnitSymbol();
    
    card.innerHTML = `
        <div class="hourly-time">${time}</div>
        <img class="hourly-icon" src="https:${hourData.condition.icon}" alt="${hourData.condition.text}">
        <div class="hourly-temp">${temp}${unitSymbol}</div>
    `;
    
    return card;
}

// ================================
// GEOLOCATION FUNCTIONS
// ================================

/**
 * Get user's current location
 */
function getCurrentLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            const query = `${latitude},${longitude}`;
            await getWeatherData(query);
        },
        (error) => {
            console.error('Geolocation error:', error);
            let message = 'Unable to access your location. ';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message += 'Please allow location access and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message += 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    message += 'Location request timed out.';
                    break;
                default:
                    message += 'Please try searching for a city instead.';
            }
            
            showError(message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    );
}

// ================================
// EVENT HANDLERS
// ================================

/**
 * Handle search button click
 */
async function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (!city) {
        elements.cityInput.focus();
        return;
    }
    
    await getWeatherData(city);
    elements.cityInput.value = '';
}

/**
 * Handle location button click
 */
function handleLocationClick() {
    getCurrentLocation();
}

/**
 * Handle unit toggle
 */
function handleUnitToggle(event) {
    const newUnit = event.target.dataset.unit;
    
    if (newUnit === weatherState.currentUnit) return;
    
    weatherState.currentUnit = newUnit;
    
    // Update active button
    elements.unitButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === newUnit);
    });
    
    // Refresh display with new units
    if (weatherState.weatherData) {
        displayCurrentWeather(weatherState.weatherData);
        displayForecast(weatherState.weatherData.forecast.forecastday);
        displayHourlyForecast(weatherState.weatherData.forecast.forecastday[0].hour);
    }
}

/**
 * Handle retry button click
 */
function handleRetry() {
    if (weatherState.currentLocation) {
        getWeatherData(weatherState.currentLocation);
    } else {
        getCurrentLocation();
    }
}

/**
 * Handle input enter key
 */
function handleInputKeyPress(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

// ================================
// INITIALIZATION
// ================================

/**
 * Initialize the application
 */
function initializeApp() {
    // Check for API key
    if (API_KEY === 'your-weatherapi-key-here') {
        showError('Please configure your WeatherAPI.com API key in script.js');
        return;
    }
    
    // Add event listeners
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.locationBtn.addEventListener('click', handleLocationClick);
    elements.retryBtn.addEventListener('click', handleRetry);
    elements.cityInput.addEventListener('keypress', handleInputKeyPress);
    
    // Add unit toggle listeners
    elements.unitButtons.forEach(btn => {
        btn.addEventListener('click', handleUnitToggle);
    });
    
    // Add debounced search on input
    const debouncedSearch = debounce(async (value) => {
        if (value.length > 2) {
            // Could implement autocomplete here
            console.log('Searching for:', value);
        }
    }, DEBOUNCE_DELAY);
    
    elements.cityInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
    
    // Load default weather data
    getCurrentLocation();
    
    // Set up periodic refresh
    setInterval(() => {
        if (weatherState.currentLocation && !weatherState.isLoading) {
            console.log('Refreshing weather data...');
            getWeatherData(weatherState.currentLocation);
        }
    }, REFRESH_INTERVAL);
    
    console.log('Vibe Weather Dashboard initialized successfully! 🌤️');
}

// ================================
// APP STARTUP
// ================================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// ================================
// SERVICE WORKER REGISTRATION (FUTURE)
// ================================

// Uncomment when implementing PWA features
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/

// ================================
// EXPORT FOR TESTING (if needed)
// ================================

// For testing purposes - not needed in production
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertTemperature,
        formatDate,
        formatTime,
        getDayName,
        debounce
    };
}
