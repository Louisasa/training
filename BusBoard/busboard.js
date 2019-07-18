const readline = require('readline');
var request = require('request');

//490008660N
const timeAndBusHashMap = {};
let timesToStation = [];

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
    let answer = await question('Please input your postcode: ');
    return answer;
}

function loadBuses(json) {
    for (let index in json) {
        // ensure is a bus
        if (json[index].modeName === "bus") {
            timeAndBusHashMap[json[index].timeToStation] = json[index];
            timesToStation.push(json[index].timeToStation);
        }
    }
}

function printNextFiveBuses() {
    timesToStation.sort(function(a, b){return a-b});

    // next five earliest
    for (let index = 0; index < 5; index++) {
        const nextBus = timeAndBusHashMap[timesToStation[index]];
        console.log(nextBus.lineName + " bus towards " + nextBus.towards + " terminating at " + nextBus.destinationName + " is " + Math.floor(nextBus.timeToStation/60) + " minutes away.");
    }
}

async function startProgram() {
    const busCode = await askForPostCode();
    request('https://api.tfl.gov.uk/StopPoint/'+busCode+'/Arrivals??app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e', function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
        }
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        const json = JSON.parse(JSON.stringify(eval("(" + body + ")")));

        loadBuses(json);
        printNextFiveBuses();
    });
}

startProgram();
//'https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e'
//https://api.tfl.gov.uk/StopPoint/490008660N?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e