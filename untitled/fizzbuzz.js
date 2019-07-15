const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let goodAnswer = false;
rl.question('What number would you like to perform Fizz rule? 3/5/13', (answer) => {
    console.log('Thank you for your valuable feedback:', answer);
    rl.close();
});
if (answer === "3" || answer === "5" || answer === "13") {
    goodAnswer = true;
    console.log("yay")
}

let i;

function fizzRule(outputArray, fizzNum) {
    if (i % fizzNum === 0) {
        outputArray.push("Fizz");
    }
}

function buzzRule(outputArray, buzzNum) {
    if (i % buzzNum === 0) {
        outputArray.push("Buzz");
    }
}

function bangRule(outputArray, bangNum) {
    if (i % bangNum === 0) {
        outputArray.push("Bang");
    }
}

function bongRule(outputArray, bongNum) {
    if (i % bongNum === 0) {
        outputArray.length = 0;
        outputArray.push("Bong");
    }
}

function fezzRule(outputArray, fezzNum) {
    if (i % fezzNum === 0) {
        let addedbool = false;
        for (var x = 0; x < outputArray.length; x++) {
            if (outputArray[x].includes("B") && !addedbool) {
                addedbool = true;
                outputArray.splice(x, 0, "Fezz")
            }
        }
        if (!addedbool) {
            outputArray.push("Fezz");
        }
    }
}

function reverseRule(outputArray, reverseNum) {
    if (i % reverseNum === 0) {
        outputArray.reverse();
    }
}

// for (i=0; i<=18; i++) {
//     const outputArray = [];
//
//     // 3 = Fizz
//     // 5 = Buzz
//     // 7 = Bang
//     // 11 = Bong ONLY
//     // 13 = Fezz but before Bs (including 11)
//     // 17 = reverse order
//     fizzRule(outputArray, 3);
//     buzzRule(outputArray, 5);
//     bangRule(outputArray, 7);
//     bongRule(outputArray, 11);
//     fezzRule(outputArray, 13);
//     reverseRule(outputArray, 17);
//     if (outputArray.length < 1) {
//         console.log(i);
//     } else {
//         const outputString = outputArray.join("");
//         console.log(outputString);
//     }
// }