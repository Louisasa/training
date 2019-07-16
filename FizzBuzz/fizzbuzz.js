const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var question = function(q) {
    return new Promise( (res, rej) => {
        rl.question( q, answer => {
            res(answer);
        })
    });
};

async function question1() {
    let answer = await question('Would you like to turn off rules? Y/N ');
    if (answer === "yes") {
        await question2();
    }
    doRules();
}

async function question2() {
    let answer1;
    while (answer1 != "Y" && answer1 != "N") {
        answer1 = await question('Would you like to turn on the fizz rule? Y/N ');
    }
    if (answer1 === "Y") {
        questionList.push(fizzRule);
    }

    do {
        answer1 = await question('Would you like to turn on the buzz rule? Y/N ');
    }while(answer1 != "Y" && answer1 != "N");
    if (answer1 === "Y") {
        questionList.push(buzzRule);
    }

    do {
        answer1 = await question('Would you like to turn on the bang rule? Y/N ');
    }while(answer1 != "Y" && answer1 != "N");
    if (answer1 === "Y") {
        questionList.push(bangRule);
    }

    do {
        answer1 = await question('Would you like to turn on the bong rule? Y/N ');
    }while(answer1 != "Y" && answer1 != "N");
    if (answer1 === "Y") {
        questionList.push(bongRule);
    }

    do {
        answer1 = await question('Would you like to turn on the fezz rule? Y/N ');
    }while(answer1 != "Y" && answer1 != "N");
    if (answer1 === "Y") {
        questionList.push(fezzRule);
    }

    do {
        answer1 = await question('Would you like to turn on the reverse rule? Y/N ');
    }while(answer1 != "Y" && answer1 != "N");
    if (answer1 === "Y") {
        questionList.push(reverseRule);
    }
}

const questionList = [];

question1();


let i;

function fizzRule(outputArray) {
    if (i % 3 === 0) {
        outputArray.push("Fizz");
    }
}

function buzzRule(outputArray) {
    if (i % 5 === 0) {
        outputArray.push("Buzz");
    }
}

function bangRule(outputArray) {
    if (i % 7 === 0) {
        outputArray.push("Bang");
    }
}

function bongRule(outputArray) {
    if (i % 11 === 0) {
        outputArray.length = 0;
        outputArray.push("Bong");
    }
}

function fezzRule(outputArray) {
    if (i % 13 === 0) {
        let addedbool = false;
        for (var x = 0; x < outputArray.length; x++) {
            if (outputArray[x].startsWith("B") && !addedbool) {
                addedbool = true;
                outputArray.splice(x, 0, "Fezz")
            }
        }
        if (!addedbool) {
            outputArray.push("Fezz");
        }
    }
}

function reverseRule(outputArray) {
    if (i % 17 === 0) {
        outputArray.reverse();
    }
}

function doRules() {
    for (i = 0; i <= 18; i++) {
        const outputArray = [];

        // 3 = Fizz
        // 5 = Buzz
        // 7 = Bang
        // 11 = Bong ONLY
        // 13 = Fezz but before Bs (including 11)
        // 17 = reverse order
        if (questionList.length < 1) {
            fizzRule(outputArray);
            buzzRule(outputArray);
            bangRule(outputArray);
            bongRule(outputArray);
            fezzRule(outputArray);
            reverseRule(outputArray);
        } else {
            for (var index = 0; index < questionList.length; index++) {
                questionList[index](outputArray);
            }
        }

        if (outputArray.length < 1) {
            console.log(i);
        } else {
            const outputString = outputArray.join("");
            console.log(outputString);
        }
    }
}
