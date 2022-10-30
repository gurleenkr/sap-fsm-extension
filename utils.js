// 
// Update html dom with provided string value
//
const updateTitle = (text) =>
  (document.querySelectorAll('#info')[0].innerText = text);

// 
// Display Weather Information
//
function updateUI(response) {
  if (!response) {
    return;
  }

  var hourly = response.hourly;
  var units = response.hourly_units;

  var dateTime = hourly.time[0] + " " + response.timezone_abbreviation;
  console.log(dateTime);
  dateTime = dateTime.split("T")[0];
  console.log(dateTime);
  dateTime = new Date(dateTime);
  console.log(dateTime);
  dateTime = dateTime.toString();
  console.log(dateTime);
  dateTime = dateTime.split("(")[0];
  console.log(dateTime);

  var weatherInfo = getWeatherDetails();
  var weatherCode = hourly.weathercode[0];
  console.log(weatherCode);
  var weatherDesc = weatherInfo.weatherCode.description;
  var weatherIcon = weatherInfo.weatherCode.icon;

  (document.querySelector('#lat').innerText = response.latitude);
  (document.querySelector('#long').innerText = response.longitude);
  (document.querySelector('#time').innerText = dateTime);
  (document.querySelector('#desc').innerText = weatherDesc);
  (document.querySelector('#icon').src = weatherIcon);
  (document.querySelector('#temp').innerText = hourly.temperature_2m[0] + units.temperature_2m);
  (document.querySelector('#rel-hum').innerText = hourly.relativehumidity_2m[0] + units.relativehumidity_2m);
  (document.querySelector('#wind').innerText = hourly.windspeed_10m[0] + units.windspeed_10m);

}

//
// Loop before a token expire to fetch a new one
//
function initializeRefreshTokenStrategy(shellSdk, auth) {

  shellSdk.on(SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION, (event) => {
    sessionStorage.setItem('token', event.access_token);
    setTimeout(() => fetchToken(), (event.expires_in * 1000) - 5000);
  });

  function fetchToken() {
    shellSdk.emit(SHELL_EVENTS.Version1.REQUIRE_AUTHENTICATION, {
      response_type: 'token'  // request a user token within the context
    });
  }

  sessionStorage.setItem('token', auth.access_token);
  setTimeout(() => fetchToken(), (auth.expires_in * 1000) - 5000);
}

// 
// Request context with activity ID to return weather of the earliestStartDateTime assigned
//
function getWeather(cloudHost, account, company, activity_id) {

  const headers = {
    'Content-Type': 'application/json',
    'X-Client-ID': 'sap-fsm-extension',
    'X-Client-Version': '1.0.0',
    'Authorization': `bearer ${sessionStorage.getItem('token')}`,
  };

  return new Promise(resolve => {

    // Fetch Activity object
    fetch(`https://${cloudHost}/api/data/v4/Activity/${activity_id}?dtos=Activity.42&account=${account}&company=${company}`, {
      headers
    })
      .then(response => response.json())
      .then(function (json) {

        console.log(json)

        const activity = json.data[0].activity;

        // Fetch Weather API
        var start_date = activity.earliestStartDateTime;
        console.log(start_date);
        start_date = start_date.split("T")[0];
        console.log(start_date);

        var date = new Date();
        var end_date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        console.log(end_date);

        fetch(`https://cors-anywhere.herokuapp.com/https://api.open-meteo.com/v1/forecast?latitude=28.6353&longitude=77.2250&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,weathercode&current_weather=true&start_date=${start_date}&end_date=${end_date}`, {
          headers
        })
          .then(response => response.json())
          .then(function (json) {
            console.log(json)
            resolve(json);
          });

      });

  });
}

// 
// Weather interpretation codes JSON
//
function getWeatherDetails() {
  var json = {
    "weather": {
      "0": {
        "description": "Clear Sky",
        "icon": "./weather_code_icons/clear_sky.png"
      },
      "1": {
        "description": "Mainly Clear",
        "icon": "./weather_code_icons/cloudy.png"
      },
      "2": {
        "description": "Partly Cloudy",
        "icon": "./weather_code_icons/cloudy.png"
      },
      "3": {
        "description": "Overcast",
        "icon": "./weather_code_icons/cloudy.png"
      },
      "45": {
        "description": "Fog",
        "icon": "./weather_code_icons/foggy.png"
      },
      "48": {
        "description": "Depositing Rime Fog",
        "icon": "./weather_code_icons/foggy.png"
      },
      "51": {
        "description": "Light Drizzle",
        "icon": "./weather_code_icons/drizzle.png"
      },
      "53": {
        "description": "Moderate Drizzle",
        "icon": "./weather_code_icons/drizzle.png"
      },
      "55": {
        "description": "Dense Drizzle",
        "icon": "./weather_code_icons/drizzle.png"
      },
      "56": {
        "description": "Light Freezing Drizzle",
        "icon": "./weather_code_icons/freezing_drizzle_rain.png"
      },
      "57": {
        "description": "Dense Freezing Drizzle",
        "icon": "./weather_code_icons/freezing_drizzle_rain.png"
      },
      "61": {
        "description": "Slight Rain",
        "icon": "./weather_code_icons/rain.png"
      },
      "63": {
        "description": "Moderate Rain",
        "icon": "./weather_code_icons/rain.png"
      },
      "65": {
        "description": "Heavy Rain",
        "icon": "./weather_code_icons/rain.png"
      },
      "66": {
        "description": "Light Freezing Rain",
        "icon": "./weather_code_icons/freezing_drizzle_rain.png"
      },
      "67": {
        "description": "Heavy Freezing Rain",
        "icon": "./weather_code_icons/freezing_drizzle_rain.png"
      },
      "71": {
        "description": "Slight Snowfall",
        "icon": "./weather_code_icons/snow_fall.png"
      },
      "73": {
        "description": "Moderate Snowfall",
        "icon": "./weather_code_icons/snow_fall.png"
      },
      "73": {
        "description": "Heavy Snowfall",
        "icon": "./weather_code_icons/snow_fall.png"
      },
      "77": {
        "description": "Snow Grains",
        "icon": "./weather_code_icons/snow_grains.png"
      },
      "80": {
        "description": "Slight Rain Showers",
        "icon": "./weather_code_icons/rain_showers.png"
      },
      "81": {
        "description": "Moderate Rain Showers",
        "icon": "./weather_code_icons/rain_showers.png"
      },
      "82": {
        "description": "Violent Rain Showers",
        "icon": "./weather_code_icons/rain_showers.png"
      },
      "85": {
        "description": "Slight Snow Showers",
        "icon": "./weather_code_icons/snow_showers.png"
      },
      "86": {
        "description": "Heavy Snow Showers",
        "icon": "./weather_code_icons/snow_showers.png"
      },
      "95": {
        "description": "Slight to Moderate Thunderstorm",
        "icon": "./weather_code_icons/thunderstorm.png"
      },
      "96": {
        "description": "Thunderstorm with Slight Hail",
        "icon": "./weather_code_icons/thunderstorm_hail.png"
      },
      "99": {
        "description": "Thunderstorm with Heavy Hail",
        "icon": "./weather_code_icons/thunderstorm_hail.png"
      }
    }
  }

  return json;
}
