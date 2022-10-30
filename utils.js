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

  (document.querySelector('#lat').innerText = response.latitude);
  (document.querySelector('#long').innerText = response.longitude);
  // (document.querySelector('#time').innerText = hourly.time[0] + " " + response.timezone_abbreviation);
  (document.querySelector('#time').innerText = dateTime);
  (document.querySelector('#code').innerText = hourly.weathercode[0]);
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
