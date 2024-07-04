const fetchBtn = document.getElementById('fetchData')
const appScreen = document.getElementsByClassName('app')
const homeScreen = document.getElementsByClassName('home')

fetchBtn.addEventListener('click', function () {
    console.log("I am calling geoLocation...");
    getLocation();

    homeScreen[0].style.display = "none"
    appScreen[0].style.display = "block"
    // console.log(homeScreen);

})

function getWindDirection(deg) {
    if (deg >= 337.5 || deg < 22.5) {
        return 'North';
    } else if (deg >= 22.5 && deg < 67.5) {
        return 'North-East';
    } else if (deg >= 67.5 && deg < 112.5) {
        return 'East';
    } else if (deg >= 112.5 && deg < 157.5) {
        return 'South-East';
    } else if (deg >= 157.5 && deg < 202.5) {
        return 'South';
    } else if (deg >= 202.5 && deg < 247.5) {
        return 'South-West';
    } else if (deg >= 247.5 && deg < 292.5) {
        return 'West';
    } else if (deg >= 292.5 && deg < 337.5) {
        return 'North-West';
    }
}

function showLoader() {
    document.getElementById('loader').style.display = 'block';
    document.getElementById('weatherData').style.display = 'none';
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('weatherData').style.display = 'block';
}

async function getWeatherData(lat, long) {

    // const apiKey = '39280627df3e8601df26c45718b1da9c';
    const apiKey = 'd5e14b4d612f2c570a3448ff071ad2d4';
    // const lat = 37.7749; // Example latitude
    // const lon = -122.4194; // Example longitude
    const part = 'minutely,hourly'; // Parts to exclude from the response
    const units = "metric"

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;

    showLoader();
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("data", data);

        setWeatherData(data)

        // document.getElementById('response').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error fetching the weather data:', error);
        document.getElementById('weatherData').innerHTML = `<button class='err'>${error.message}.</button>`;
    } finally {
        hideLoader();
    }
}

function setWeatherData(data) {
    console.log("Preparing data...");
    const arr = {
        "Location": "Asia",
        "Wind Speed": data?.current.wind_speed + ' kmph',
        "Humidity": data?.current.humidity,
        "Time Zone": "GMT +5:30",
        "Pressure": data?.current.pressure + " mBar",
        "Wind Direction": getWindDirection(data?.current.wind_deg),
        "UV Index": data?.current?.uvi,
        "Feels like": data?.current?.feels_like + "°"
    }
    // data?.current
    console.log(document.getElementById('weatherData'));
    let dataHtml = "";

    for (const property in arr) {
        dataHtml += `<button class='btn mg'>${property}: ${arr[property]}</button>`
    }

    document.getElementById('weatherData').innerHTML = dataHtml;
    console.log("dataHtml", dataHtml);

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("location").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // console.log(document.getElementsByClassName('lat'));
    document.getElementById("location").style.display = "flex"

    document.getElementsByClassName('lat')[0].innerText = "Lat: " + latitude;
    document.getElementsByClassName('long')[0].innerText = "Long: " + longitude;
    document.getElementById('map').style.display = 'block'
    document.getElementById('map').src = `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed`

    getWeatherData(latitude, longitude)
}

function showError(error) {
    console.log("error", error);
    document.getElementById("location").style.display = "flex"
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("location").innerHTML = `<button class='err'>User denied the request for Geolocation.</button>`;
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("location").innerHTML = `<button class='err'>Location information is unavailable.</button>`;
            break;
        case error.TIMEOUT:
            document.getElementById("location").innerHTML = `<button class='err'>The request to get user location timed out.</button>`;
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("location").innerHTML = `<button class='err'>An unknown error occurred.</button>`;
            break;
    }
}