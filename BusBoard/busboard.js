var request = require('request');
const busCode = "490008660N";
request('https://api.tfl.gov.uk/StopPoint/'+busCode+'?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e', function (error, response, body) {
    if (error) {
        console.log('error:', error); // Print the error if one occurred
    }
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    const jsonString = JSON.parse(JSON.stringify(eval("(" + body + ")")));
    // need next five buses
    // their routes
    // destinations
    // time until they arrive in minutes

    // todo: check mode is bus
    console.log(typeof jsonString);
    console.log(jsonString)

    // number of modes is number of types of travel that go to the stop so one in this case (0 = bus)
    // children are the buses that visit this stop (this case 218 and 88)
    // can check modes here to double check they are buses
    // 
});
//'https://api.tfl.gov.uk/StopPoint/Mode/bus/Disruption?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e'
//https://api.tfl.gov.uk/StopPoint/490008660N?app_id=86384f92&app_key=76aef114aa28b5f462c50654c942969e