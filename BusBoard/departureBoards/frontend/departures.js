
async function begin() {

    var xhttp = new XMLHttpRequest();

    var postcode = document.getElementById("postcode").value;
    const url = `http://localhost:3000/departureBoards?postcode=${postcode}`;

    xhttp.open('GET', url, true);

    xhttp.setRequestHeader('Content-Type', 'application/json');


    xhttp.onload = function() {
        // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
        // todo: create divs etc on demand to fill

        const jsonResult = JSON.parse(xhttp.responseText);

        if (jsonResult.error === undefined) {
            for (let index = 1; index <= jsonResult.length; index++) {

                document.getElementById("Stop"+index).innerHTML = jsonResult[index-1].stop + " Bus Stop";
                const nextBuses = jsonResult[index-1].buses;

                for (let index2 = 1; index2 <= nextBuses.length; index2++) {
                    let nextBus = nextBuses[index2-1];
                    const outputString = nextBus.lineName + " bus towards "
                        + nextBus.towards + " terminating at "
                        + nextBus.destinationName + " is "
                        + Math.floor(nextBus.timeToStation / 60) + " minutes away. \n";
                    document.getElementById("Stop"+index+"Bus"+index2).innerHTML = outputString;
                }
            }
        } else {
            document.getElementById("Stop1").innerHTML = "Error 500. Server error";
        }


    };
    xhttp.send();

    //event.preventDefault();
    return false;
}

// window.onload = () => {
//     document.getElementById("form").addEventListener('submit', function() {
//         begin();
//     })
// };