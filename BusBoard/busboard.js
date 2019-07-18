var request = require('request');
const busCode = "490008660N";
request('https://api.tfl.gov.uk/StopPoint/'+busCode+'/Arrivals??app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e', function (error, response, body) {
    if (error) {
        console.log('error:', error); // Print the error if one occurred
    }
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    const jsonString = JSON.parse(JSON.stringify(eval("(" + body + ")")));
    // need next five buses
    // their routes
    // destinations
    // time until they arrive in minutes

    // returns the next 6 buses, need the next 5 (but not in order)
    // lineName is the name
    // also make sure modeName is bus
    // timeToStation is in seconds
    // destinationName is their destination
    // route is towards? maybe idk

    const timeHashMap = {};
    let timesToStation = [];
    for (let index in jsonString) {
        // ensure is a bus
        if (jsonString[index].modeName === "bus") {
            timeHashMap[jsonString[index].timeToStation] = jsonString[index];
            timesToStation.push(jsonString[index].timeToStation);
        }
    }
    
    timesToStation.sort(function(a, b){return a-b});

    // next five earliest
    for (let index = 0; index < 5; index++) {
        const nextBus = timeHashMap[timesToStation[index]];
        console.log(nextBus.lineName + " bus towards " + nextBus.towards + " terminating at " + nextBus.destinationName + " is " + Math.floor(nextBus.timeToStation/60) + " minutes away.");
    }
});
//'https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e'
//https://api.tfl.gov.uk/StopPoint/490008660N?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e