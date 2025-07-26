const apiKey = 'API_KEY'; // Replace with your WeatherAPI.com API key
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherChart = document.getElementById('weatherChart');
let chart;

// Register the datalabels plugin
Chart.register(ChartDataLabels);

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeather(city);
    }
});

async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            alert(data.error.message);
        } else {
            const todayForecast = data.forecast.forecastday[0].day;
            cityName.textContent = data.location.name;
            temperature.textContent = `${Math.round(todayForecast.avgtemp_c)}°C`;
            description.textContent = todayForecast.condition.text;
            updateChart(data.forecast.forecastday);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function updateChart(forecast) {
    const dates = forecast.map(day => day.date);
    const temps = forecast.map(day => day.day.avgtemp_c);

    if (chart) {
        chart.destroy();
    }

    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const padding = (maxTemp - minTemp) * 0.2 || 2;

    chart = new Chart(weatherChart, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Average Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            plugins: {
                datalabels: {
                    backgroundColor: 'rgba(0, 123, 255, 0.7)',
                    color: 'white',
                    borderRadius: 4,
                    padding: 4,
                    anchor: 'end',
                    align: 'top',
                    font: {
                        weight: 'bold'
                    },
                    formatter: (value, context) => {
                        return `${value.toFixed(1)}°C`;
                    }
                }
            },
            scales: {
                y: {
                    min: minTemp - padding,
                    max: maxTemp + padding
                }
            }
        }
    });
}
