//======================================================================================\\
//==========================================SET UP========================================\\
//==========================================================================================\\

// You need a rollable table named "Weather"
// The base weather that needs table items on that table are:
//      Cold
//      Hot
//      Misty
//      Rainy
//      Windy
//      Temperate
// These can be weighted - that will factor in

// You can have a table item that combines more than one weather type to but it should be formated like so:
//  Cold,Rain
//  Notice the comma and NO SPACES.
//  You can't combine Temperate with any other weather types.

// At the end of this document, you'll find links to specific handouts: you'll need to replace them with your own.
// I have handouts with all the weather modifiers for ease of reference during play. 

//==============================================================================\\
//=====================================USING======================================\\
//==================================================================================\\

// Once that's all set up, all you need to do is type "!weather" into chat to get that day's weather.

on("ready", function () {
    on("chat:message", function (msg) {
        if (msg.type == "api" && msg.content.indexOf("!weather") == 0) {

            var todaysWeather = generateWeather();
            sendChat("Today's Weather", `${createWeatherString(todaysWeather)}`);
        }
    })
})

function generateWeather() {
    var weatherWithWeights = [];
    var weatherTable = findObjs({
        type: "rollabletable",
        name: "Weather"
    });
    var weatherTableItems = findObjs({
        type: 'tableitem',
        rollabletableid: weatherTable[0].get("id")
    });

    weatherTableItems.forEach(function (element, index, list) {
        var i,
            weight = parseInt(element.get('weight'));

        for (i = 0; i < weight; i++) {
            weatherWithWeights.push(element.get('name'));
        }
    });
    return weatherWithWeights[Math.floor(Math.random() * weatherWithWeights.length)].split(",");
}

function createWeatherString(todaysWeather) {
    var weatherString = "";
    var ending = "<br/> (click on the weather's name to bring up its handout)";

    if (todaysWeather.length === 1 && todaysWeather[0] === 'Temperate') {
        return `**[${todaysWeather[0]}](${todaysWeather[0]})** <br/> (no modifiers)`
    } else if (todaysWeather.length === 1) {
        return `**[${todaysWeather[0]}](${returnLink(todaysWeather[0])})**${ending}`
    }

    todaysWeather.forEach((weather, index, array) => {
        weatherString += `**[${weather}](${returnLink(weather)})**`;
        if (index !== array.length - 1) { weatherString += " & " }
    })
    return weatherString += ending
}

function returnLink(weather) {
    switch (weather) {
        case "Cold":
            return "http://journal.roll20.net/handout/-MaP-kF63z9uA6ucQj6u";
        case "Hot":
            return "http://journal.roll20.net/handout/-MaP-qCdfkD8LcGZn3CS";
        case "Misty":
            return "http://journal.roll20.net/handout/-MaP-xww4LT3y6x-DtBT";
        case "Rainy":
            return "http://journal.roll20.net/handout/-MaP0-zCeatcsWjCQA8k";
        case "Windy":
            return "http://journal.roll20.net/handout/-MaP02K1TWaWF5_7OvFN";
    }
}