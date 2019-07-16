const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

class Account {

    constructor(name, balance) {
        this.name = name;
        this.balance = balance;
        this.transactions = [];
    }

    transaction(amount, narrative, dateStr) {
        this.balance += amount;
        this.transactions.push({date : dateStr, payingIn: amount>0, narrative : narrative});
    }

    getTransactions() {
        return this.transactions;
    }

    getAmount() {
        return this.balance;
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
    const logger = log4js.getLogger('debug');
    logger.debug("Started running");

    const accounts = {};

    fs.createReadStream('DodgyTransactions2015.csv')
        .pipe(csv())
        .on('data', (row) => {
        // date
        // from
        // to
        // narrative
        // amount

            // check that user has account if not init
            // look up account, add transaction
        logger.debug(row["From"] + " is paying " + row["To"]);
        logger.debug(row["Amount"]);
        logger.debug(row["Date"]);
        if (!(row["From"] in accounts)) {
            accounts[row["From"]] = {account: new Account(row["From"], 0)};
        }
        accounts[row["From"]].account.transaction(parseInt(row["Amount"])*-1, row["Narrative"], row["Date"]);
        if (!(row["To"] in accounts)) {
            accounts[row["To"]] = {account: new Account(row["From"], 0)};
        }
        accounts[row["To"]].account.transaction(parseInt(row["Amount"]), row["Narrative"], row["Date"]);
})
.on('end', () => {
    if (name.length < 1) {
        for (accountName in accounts) {
            const tmpAccount = accounts[accountName].account;
            console.log(accountName + ": " + tmpAccount.getAmount());
        }
    } else {
        console.log(name);
        if (name in accounts) {
            console.log(accounts[name].account.getTransactions());
        } else {
            console.log("Name does not have an account");
        }

    }
});

}

askQuestion();