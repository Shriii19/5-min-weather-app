# Vibe Coded Weather Dashboard Website

A modern, responsive weather dashboard built with vanilla HTML, CSS, and JavaScript that provides real-time weather information with a vibrant, user-friendly interface powered by WeatherAPI.com.

## 🌟 Features

- **Real-time Weather Data**: Current conditions, temperature, humidity, and more
- **Location-based Forecasting**: Automatic location detection or manual city search
- **5-Day Weather Forecast**: Extended weather outlook with daily summaries
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dynamic Backgrounds**: Weather-themed visual effects and animations
- **Clean UI/UX**: Intuitive interface with smooth transitions and modern styling
- **Fast Loading**: Lightweight vanilla JavaScript implementation

## 📸 Screenshots

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/1fc24a91-f5b5-4005-b191-2950c7c8f5a5" />


## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling, flexbox/grid layouts, animations
- **Vanilla JavaScript**: DOM manipulation, API calls, and interactivity
- **WeatherAPI.com**: Reliable weather data provider
- **Responsive Design**: Mobile-first approach

## 🔧 Installation & Setup

### Prerequisites

- A modern web browser
- WeatherAPI.com API key (free tier available)

### Steps

1. **Clone the repository**
git clone https://github.com/yourusername/vibe-coded-weather-dashboard.git
cd vibe-coded-weather-dashboard


2. **Get your API key**
- Visit [WeatherAPI.com](https://www.weatherapi.com/)
- Sign up for a free account
- Generate your API key from the dashboard

3. **Configure the API key**
- Open `script.js`
- Replace the placeholder with your actual API key:
const API_KEY = 'your-weatherapi-key-here';


4. **Launch the application**
- Open `index.html` in your web browser


## 🔑 API Configuration

The dashboard uses WeatherAPI.com for weather data. Key endpoints utilized:

- **Current Weather**: `/current.json`
- **Forecast Data**: `/forecast.json`
- **Search/Autocomplete**: `/search.json`

### API Features Used

- Current weather conditions
- 3-day weather forecast
- Location search and autocomplete

## ⚙️ Configuration Options

You can customize various aspects of the dashboard:


## 🎨 Customization

### Styling
- Modify `style.css` for visual customization
- Update color schemes in CSS custom properties
- Add new animations or transitions

### Functionality
- Extend weather data display in `script.js`
- Add new weather metrics or charts
- Implement weather alerts and notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For higher limits, consider upgrading to a paid plan.

## 🔐 Security Notes

- Never commit your API key to version control
- Use environment variables or config files (gitignored)
- Implement proper error handling for API failures
- Consider API key rotation for production use

## 📋 Todo / Roadmap

- [ ] Add weather maps integration
- [ ] Implement user preferences storage
- [ ] Add weather alerts and notifications
- [ ] Include air quality data
- [ ] Dark/light theme toggle
- [ ] Multiple location support
- [ ] Weather data export functionality

## 🐛 Known Issues

- Geolocation may not work on HTTP (requires HTTPS)
- Some older browsers may have limited CSS Grid support

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the WeatherAPI.com documentation
- Review browser console for error messages

**Made with ❤️ and lots of ☕**
