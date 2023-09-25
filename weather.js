const api_key = "d764ca377f9cbb6ccfc303a5bb4306e4";

async function loadCurrentLocationWeather() {
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        append(data);

        await fetchNext5DaysWeather(latitude, longitude);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

async function searchWeather() {
    const city = document.getElementById("city").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        append(data);

        await fetchNext5DaysWeather(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchNext5DaysWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${api_key}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        appendNext5DaysData(data.daily);

    } catch (error) {
        console.error("Error fetching next 5 days data:", error);
    }
}

function append(data) {
    const container = document.getElementById("container");
    container.innerHTML = null;
    const time = document.createElement("p");
    time.innerText = new Date().toDateString();
    time.style = "color:red;font-size:25px";
    const h3 = document.createElement("h3");
    h3.innerText = data.name;
    const img1 = document.createElement("img");
    img1.src = "https://assets.dryicons.com/uploads/icon/preview/9586/small_1x_2654f47d-729a-4a14-977f-f4f4273454d6.png";
    const p1 = document.createElement("p");
    p1.innerText = `${Math.floor(data.main.temp * 0.1)}C`;
    const br1 = document.createElement("br");
    const img2 = document.createElement("img");
    img2.src = "https://assets.dryicons.com/uploads/icon/preview/8035/small_1x_11ee595a-7777-45de-a1eb-9e3ab14d1cd1.png";
    const p2 = document.createElement("p");
    p2.innerText = `Max temp: ${Math.floor(data.main.temp_max * 0.1)}C`;
    const br2 = document.createElement("br");
    const img3 = document.createElement("img");
    img3.src = "https://img.icons8.com/color/344/smiling-sun.png";
    const p3 = document.createElement("p");
    p3.innerText = `Min temp: ${Math.floor(data.main.temp_min * 0.1)}C`;
    const br3 = document.createElement("br");
    const img4 = document.createElement("img");
    img4.src = "https://img.icons8.com/color/344/wind.png";
    const p4 = document.createElement("p");
    p4.innerText = `Wind speed: ${(data.wind.speed * 10).toFixed(2)}km/h`;
    const br4 = document.createElement("br");
    const img5 = document.createElement("img");
    img5.src = "https://img.icons8.com/color/344/clouds.png";
    const p5 = document.createElement("p");
    p5.innerText = `Cloud: ${data.weather[0].description}`;
    const br5 = document.createElement("br");
    const img6 = document.createElement("img");
    img6.src = "https://img.icons8.com/color/344/sunrise.png";
    const p6 = document.createElement("p");
    const sunriseTimestamp = data.sys.sunrise * 1000;
    const sunriseDate = new Date(sunriseTimestamp);
    const hours = sunriseDate.getHours();
    const minutes = sunriseDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    p6.innerText = `Sunrise: ${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    const br6 = document.createElement("br");
    const img7 = document.createElement("img");
    img7.src = "https://img.icons8.com/color/344/sunset.png";
    const p7 = document.createElement("p");
    const sunsetTimestamp = data.sys.sunset * 1000;
    const sunsetDate = new Date(sunsetTimestamp);
    const hours1 = sunsetDate.getHours();
    const minutes1 = sunsetDate.getMinutes();
    const ampm1 = hours1 >= 12 ? "pm" : "am";
    const formattedHours1 = hours1 % 12 || 12;
    p7.innerText = `Sunset: ${formattedHours1}:${minutes1.toString().padStart(2, "0")} ${ampm1}`;
    const div1 = document.createElement("div");
    div1.setAttribute("id", "div1");
    div1.append(time, h3,
        img1,
        p1,
        br1);
    const div2 = document.createElement("div");
    div2.append(img2,
        p2,
        br2,
        img3,
        p3,
        br3,
        img4,
        p4,
        br4);
    const div3 = document.createElement("div");
    div3.append(img5,
        p5,
        br5,
        img6,
        p6,
        br6,
        img7,
        p7);
    const div4 = document.createElement("div");
    div4.setAttribute("id", "div4");
    div4.append(div2, div3);
    container.append(div1, div4);
    const iframe = document.getElementById("gmap");
    iframe.src = `https://maps.google.com/maps?q=${data.name}&t=k&z=13&ie=UTF8&iwloc=&output=embed`;
}

function appendNext5DaysData(dailyData) {
    const next5daysdata = document.querySelector(".next5daysdata");
    next5daysdata.innerHTML = "";

    dailyData.slice(1, 6).forEach((day) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en", { weekday: "long" });
        const temperature = Math.floor(day.temp.day * 0.1) + "°C";
        const description = day.weather[0].description;

        const dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");

        const dayNameElement = document.createElement("p");
        dayNameElement.innerText = dayName;

        const temperatureElement = document.createElement("p");
        temperatureElement.innerText = `${temperature}`;

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = `${description}`;

        dayContainer.appendChild(dayNameElement);
        dayContainer.appendChild(temperatureElement);
        dayContainer.appendChild(descriptionElement);

        next5daysdata.appendChild(dayContainer);
    });
}