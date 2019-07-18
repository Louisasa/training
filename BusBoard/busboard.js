const readline = require('readline');
const request = require('request');
const _ = require('lodash');
const express = require("express");

const app = express();
const port = 3000;

//490008660N
//NW5 1TL

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(q) {
    return new Promise((res, rej) => {
        rl.question(q, answer => {
            res(answer);
        })
    });
}

async function askForPostCode() {
    return await question('Please input your postcode: ');
}

async function requestLocationOfPostcode(postCode) {
    return new Promise((resolve, reject) => {
        request('https://api.postcodes.io/postcodes/' + postCode, (error, response, body) => {
            if (error) {
                reject(error);
                console.log("error:", error);
                return;
            }

            const result = JSON.parse(body).result;
            const lat = result.latitude;
            const lon = result.longitude;
            resolve({lat, lon});
        });
    });
}

async function requestNearestStop(lat, lon) {
    return new Promise((resolve, reject) => {
        request("https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&lat=" + lat + "&lon=" + lon + "&app_key=76aef114aa28b5f462c50654c942969e&app_id=86384f92", (error, response, body) => {
            if (error) {
                reject(error);
                console.log("error:", error);
            }
            const stopPointsNearLocation = JSON.parse(body).stopPoints;

            const closestBusStops = _
                .chain(stopPointsNearLocation)
                .filter(stopPoint => stopPoint.modes.includes('bus'))
                .sortBy('distance')
                .take(3)
                .value();

            resolve(closestBusStops);
        });
    });
}

function requestNextBuses(busStop) {
    return new Promise((resolve, reject) => {
        request('https://api.tfl.gov.uk/StopPoint/' + busStop.id + '/Arrivals??app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e', (error, response, body) => {
            if (error) {
                reject(error);
                console.log('error:', error); // Print the error if one occurred
            }
            const results = JSON.parse(body);

            const nextBuses = _
                .chain(results)
                .filter(function (nextBus) {
                    return nextBus.modeName.includes("bus");
                })
                .sortBy(function (nextBus) {
                    return nextBus.timeToStation
                })
                .take(5)
                .value();

            resolve(nextBuses);
        });
    });
}

function printBuses(closestBusStop, nextBuses) {
    console.log(closestBusStop.commonName + " Bus Stop");
    for (let index = 0; index < nextBuses.length; index++) {
        let nextBus = nextBuses[index];
        app.get('/', function (req, res) {
            res.send(nextBus.lineName + " bus towards " + nextBus.towards + " terminating at " + nextBus.destinationName + " is " + Math.floor(nextBus.timeToStation / 60) + " minutes away.")
        });
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    }
}

async function startProgram() {
    const postCode = await askForPostCode();
    const location = await requestLocationOfPostcode(postCode);
    const closestBusStops = await requestNearestStop(location.lat, location.lon);
    for (let index = 0; index < closestBusStops.length; index++) {
        const nextBuses = await requestNextBuses(closestBusStops[index]);
        printBuses(closestBusStops[index], nextBuses);
    }
}

startProgram();