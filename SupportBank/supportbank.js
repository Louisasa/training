class Account {
    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
    }

    addToBalance(amount) {
        this.balance += amount;
    }

    removeFromBalance(amount) {
        this.balance -= amount;
    }
}

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

async function askQuestion() {
    let answer = await question('List all or specific account? ');
    if (answer.toLowerCase() === "all") {
        readInCSV("");
    } else {
        readInCSV(answer);
    }
}

async function readInCSV(name) {
    const csv = require('csv-parser');
    const fs = require('fs');

    const accounts = {};

    fs.createReadStream('Transactions2014.csv')
        .pipe(csv())
        .on('data', (row) => {
        //console.log(row);
        // date
        // from
        // to
        // narrative
        // amount
        if (row["From"] in accounts) {
        accounts[row["From"]].account.removeFromBalance(parseInt(row["Amount"]));
    } else {
        accounts[row["From"]] = {account: new Account(row["From"], parseInt(row["Amount"]))};
    }
    if (row["To"] in accounts) {
        accounts[row["To"]].account.addToBalance(parseInt(row["Amount"]));
    } else {
        accounts[row["To"]] = {account: new Account(row["To"], parseInt(row["Amount"]))};
    }
})
.on('end', () => {
    if (name.length < 1) {
        for (accountName in accounts) {
            console.log(accounts[accountName].account);
        }
    } else {
        console.log(accounts[name]);
    }
});

}

askQuestion();