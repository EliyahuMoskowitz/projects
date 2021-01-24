/* global pcs*/
(function () {
    'use strict';

    let locator = document.querySelector('#find-me'), unitInput = $('#units'), zipInput = $('#zip'),
        latitude, longitude, typeUnits, units, display = $('#middle');;
    const mapLink = document.createElement('a');

    locator.addEventListener('click', geoFindMe);
    zipInput.on('change', ({target: t}) => weather(t.value))

    function geoFindMe() {

        const status = document.querySelector('#status');

        function success(position) {
            console.log(position);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            status.textContent = '';
            weather();
        }

        function error() {
            status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        } else {
            status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }

    }

    function weather(zip) {
        // document.body.removeChild(locator);
        // document.body.removeChild(unitInput[0]);
        display.empty();
        units = unitInput.val();
        const apiKey = '560dcb7398e09264815a14af891179c4';
        let theUrl = zip ? `zip=${zip}` : `lat=${latitude}&lon=${longitude}`;
        //fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&zip=${zip}&units=imperial`)
        fetch(`http://api.openweathermap.org/data/2.5/weather?${theUrl}&appid=${apiKey}&units=${units}`)
            .then(async r => {
                if (!r.ok) {
                    //I got the message this way
                    let x = await r.json();
                    let msg = x.message;
                    throw new Error(`${r.status} ${r.statusText} ${msg}`);
                }
                return r.json();
            })
            .then(weather => { console.log(weather); showWeather(weather); })
            .catch(err => pcs.messageBox.show(err));
    }
    function showWeather(weatherData) {
        decideUnits(units);
        let specialW = [weatherData.name, `${weatherData.main.temp} ° ${typeUnits}`, weatherData.weather[0].description,
        `RealFeel: ${weatherData.main.feels_like}`, `Humidity: ${weatherData.main.humidity}`];
        specialW.forEach((e, i) => {
            if (i === 3) {
                $(`<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="Description Icon"/>`).appendTo(display);
            }
            $('<pre id="name"></pre>').text(e).appendTo(display);
        });
        if(!zip){
        mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        mapLink.target = '_blank'; mapLink.id = 'map-link';
        $('<aside></aside>').html(`You are Located at the follwing coordiantes: <br/>Latitude: ${latitude.toFixed(2)} °, Longitude: ${longitude.toFixed(2)} °`).appendTo(display);
        mapLink.textContent = 'Show Where you are on Map';
        display.append(mapLink);
        }
    }

    function decideUnits(u) {
        if (u.toLowerCase() === 'imperial') {
            typeUnits = 'Farenheit';
        } else if (u.toLowerCase() === 'metric') {
            typeUnits = 'Celcius';
        } else {
            typeUnits = 'Kelvin';
        }
    }
}());
