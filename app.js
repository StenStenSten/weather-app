const https = require("https");

const latitude = 59.4;
const longitude = 24.7;
const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;

const options = {
    headers: {
        "User-Agent": "weather-app/1.0"
    }
};

https.get(url, options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
        data += chunk;
    });

    res.on("end", () => {
        try {
            const jsonData = JSON.parse(data);
            const timeseries = jsonData.properties?.timeseries;

            if (timeseries) {
                timeseries.forEach((entry) => {
                    const time = entry.time;
                    const airTemperature = entry.data?.instant?.details?.air_temperature;

                    if (time && airTemperature !== undefined) {
                        console.log(`${time} ${airTemperature}C`);
                    }
                });
            }
        } catch (err) {
            console.error("Error parsing JSON:", err.message);
        }
    });
}).on("error", (err) => {
    console.error("Error fetching data:", err.message);
});
