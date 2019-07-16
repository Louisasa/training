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

async function askImportQuestion() {
    let answer = await question('Please input the name of your file: ');
    if (answer.includes("json")) {
        askQuestion(answer, readInJSON);
    } else if (answer.includes("csv")) {
        askQuestion(answer, readInCSV);
    } else {
        console.log("Please input a json or csv file. ")
        askImportQuestion();
    }
}

async function askQuestion(filename, func) {
    let answer = await question('List all or specific account? ');
    if (answer.toLowerCase() === "all") {
        func("", filename);
    } else {
        func(answer, filename);
    }
}

async function parseData(row, toAccount, fromAccount) {
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
    if (!(row[fromAccount] in accounts)) {
        accounts[row[fromAccount]] = {account: new Account(row[fromAccount], 0)};
    }
    accounts[row[fromAccount]].account.transaction(parseInt(row["Amount"])*-1, row["Narrative"], row["Date"]);
    if (!(row[toAccount] in accounts)) {
        accounts[row[toAccount]] = {account: new Account(row[toAccount], 0)};
    }
    accounts[row[toAccount]].account.transaction(parseInt(row["Amount"]), row["Narrative"], row["Date"]);
}

async function finishedParsing(name) {
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
}

async function readInCSV(name, filename) {
    const csv = require('csv-parser');
    const fs = require('fs');
    logger.debug("Started running");

    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
        parseData(row, "To", "From");
})
.on('end', () => {
    finishedParsing(name);
});
}

async function readInJSON(name, filename) {
    logger.debug("Started running");
    const fs = require('fs');

    let rawdata = fs.readFileSync(filename);
    const file = JSON.parse(rawdata);
    console.log(file.length)
    for (let index = 0; index < file.length; index++) {
        await parseData(file[index], "ToAccount", "FromAccount")
    }
    console.log("cool");
    finishedParsing(name);
}

const accounts = {};
const logger = log4js.getLogger('debug');
askImportQuestion();