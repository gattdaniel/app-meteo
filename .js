document.addEventListener("DOMContentLoaded", function () {
  let ville;

  if ("geolocation" in navigator) {
    var option = {
      enableHighAccuracy: true,
    };
    navigator.geolocation.watchPosition(
      (position) => {
        let url =
          "https://api.openweathermap.org/data/2.5/weather?lon=" +
          position.coords.longitude +
          "&lat=" +
          position.coords.latitude +
          "&appid=542c414d6ce0272369445a69d32db8c4&units=metric&";

        let requete = new XMLHttpRequest();
        requete.open("GET", url);
        requete.responseType = "json";
        requete.send();

        requete.onload = function () {
          if (requete.status === 200) {
            let reponse = requete.response;
            console.log(reponse);
            temperature = reponse.main.temp;
            ville = reponse.name;
            document.querySelector("#ville").textContent = ville;
            prevision();
            initialiser();
          } else {
            alert("un probleme est survenu");
          }
        };
      },
      erreur,
      option
    );
  } else {
    ville = "douala";
    initialiser();
    prevision();
  }

  function erreur() {
    ville = "douala";
    initialiser();
    prevision();
  }
  document.querySelector(".changer").addEventListener("click", () => {
    const city = document.getElementById("city-input").value;
    if (city && city.trim() !== "") {
      ville = city.trim();
      url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        ville +
        "&appid=542c414d6ce0272369445a69d32db8c4&units=metric";
      initialiser();
      prevision();
    } else {
      alert("Veuillez entrer une ville.");
    }
  });

  function initialiser() {
    let url =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      ville +
      "&appid=542c414d6ce0272369445a69d32db8c4&units=metric";

    let requete = new XMLHttpRequest();
    requete.open("GET", url);
    requete.responseType = "json";
    requete.send();

    requete.onload = function () {
      if (requete.status === 200) {
        let reponse = requete.response;
        temperature = reponse.main.temp;
        let ville = reponse.name;
        const iconCode = reponse.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        const sunriseTime = new Date(
          reponse.sys.sunrise * 1000
        ).toLocaleTimeString();
        const sunsetTime = new Date(
          reponse.sys.sunset * 1000
        ).toLocaleTimeString();
        document.getElementById("weather-icon").src = iconUrl;
        document.getElementById(
          "temperature_label"
        ).innerText = `🌡${reponse.main.temp}`;
        document.getElementById(
          "description"
        ).innerText = ` ${reponse.weather[0].description}`;
        document.getElementById(
          "feels-like"
        ).innerText = ` Ressentie : ${reponse.main.feels_like}°C`;
        document.getElementById(
          "humidity"
        ).innerText = ` Humidité : ${reponse.main.humidity}%`;
        document.getElementById(
          "pressure"
        ).innerText = ` Pression : ${reponse.main.pressure} hPa`;
        document.getElementById(
          "wind-speed"
        ).innerText = ` Vent : ${reponse.wind.speed} m/s`;
        document.getElementById(
          "wind-direction"
        ).innerText = ` Direction : ${reponse.wind.deg}°`;
        document.querySelector("#ville").textContent = ville;
        document.getElementById("sunrise").innerText = sunriseTime;
        document.getElementById("sunset").innerText = sunsetTime;
      } else {
        alert("un probleme est survenu");
      }
    };
  }
  setInterval(initialiser, 1000);

  console.log("🚨 Avant l'appel de prevision(), ville =", ville);

  function prevision() {
    console.log("Ville utilisée pour la prévision :", ville);
    let urlForecast =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      ville +
      "&appid=542c414d6ce0272369445a69d32db8c4&units=metric";

    let requeteForecast = new XMLHttpRequest();
    requeteForecast.open("GET", urlForecast);
    requeteForecast.responseType = "json";
    console.log("🔗 URL utilisée :", urlForecast);

    requeteForecast.send();

    requeteForecast.onload = function () {
      if (requeteForecast.status === 200) {
        let reponse = requeteForecast.response;
        console.log("Prévisions météo :", reponse);

        // meteo sur les 12 prochaines heures
        let hourlyContainer = document.getElementById("hourly-container");
        hourlyContainer.innerHTML = "";
        for (let i = 0; i < 10; i++) {
          let hourData = reponse.list[i];
          let div = document.createElement("div");
          div.classList.add("forecast-box");
          div.innerHTML = `
                    <p>🕒 ${hourData.dt_txt.split(" ")[1]}</p>
                    <img src="https://openweathermap.org/img/wn/${
                      hourData.weather[0].icon
                    }@2x.png">
                    <p>🌡️ ${hourData.main.temp}°C</p>
                `;
          hourlyContainer.appendChild(div);
          // meteo sur les 5 prochains jour
          let weeklyContainer = document.getElementById("weekly-container");
          weeklyContainer.innerHTML = "";
          let dailyForecasts = {};
          reponse.list.forEach((item) => {
            let date = item.dt_txt.split(" ")[0];
            if (!dailyForecasts[date]) dailyForecasts[date] = item;
          });
          Object.values(dailyForecasts).forEach((day) => {
            let div = document.createElement("div");
            div.classList.add("forecast-box");
            div.innerHTML = `
                        <p>📅 ${day.dt_txt.split(" ")[0]}</p>
                        <img src="https://openweathermap.org/img/wn/${
                          day.weather[0].icon
                        }@2x.png">
                        <p>🌡️ Min: ${day.main.temp_min}°C / Max: ${
              day.main.temp_max
            }°C</p>
                    `;
            weeklyContainer.appendChild(div);
          });
        }
      } else {
        alert("🚨 Un problème est survenu avec la requête Forecast.");
      }
    };
  }
  prevision();
});
