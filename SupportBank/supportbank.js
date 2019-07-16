const log4js = require('log4js');

log4js.configure({
    appenders: {
        file: {type: 'fileSync', filename: 'debug.log'}
    },
    categories: {
        default: {appenders: ['file'], level: 'debug'}
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
        this.transactions.push({date: dateStr, payingIn: amount > 0, narrative: narrative});
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

function question(q) {
    return new Promise((res, rej) => {
        rl.question(q, answer => {
            res(answer);
        })
    });
}

async function askForFilename() {
    let answer;
    do {
        answer = await question('Please input the name of your file: ');
    }while (!answer.includes("json") && !answer.includes("csv"));
    return answer;
}

async function askAboutAccountNameToOutput() {
    let answer = await question('List all or specific account? ');
    if (answer.toLowerCase() === "all") {
        return "";
    } else {
        return answer;
    }
}

function parseData(row, toAccount, fromAccount, accounts) {
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
    accounts[row[fromAccount]].account.transaction(parseInt(row["Amount"]) * -1, row["Narrative"], row["Date"]);
    if (!(row[toAccount] in accounts)) {
        accounts[row[toAccount]] = {account: new Account(row[toAccount], 0)};
    }
    accounts[row[toAccount]].account.transaction(parseInt(row["Amount"]), row["Narrative"], row["Date"]);
    return accounts;
}

function outputAccounts(name, accounts) {
    if (name.length < 1) {
        for (let accountName in accounts) {
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

function csvParsing(filename, accounts,csv,fs) {
    return new Promise((res, rej) => {
        fs.createReadStream(filename)
            .pipe(csv())
            .on('data', (row) => {
                accounts = parseData(row, "To", "From", accounts);
            })
            .on('end', () => res(accounts));
    });
}

async function readInCSV(filename) {
    const csv = require('csv-parser');
    const fs = require('fs');
    logger.debug("Started running");
    let accounts = [];

    return csvParsing(filename, accounts,csv,fs);
}

function readInJSON(filename) {
    logger.debug("Started running");
    const fs = require('fs');

    let rawdata = fs.readFileSync(filename);
    const file = JSON.parse(rawdata);
    let accounts = [];
    for (let index = 0; index < file.length; index++) {
        accounts = parseData(file[index], "ToAccount", "FromAccount", accounts);
    }
    return accounts;
}

async function readInAccounts(filename) {
    if (filename.includes("csv")) {
        return await readInCSV(filename);
    } else {
        return readInJSON(filename);
    }
}

const logger = log4js.getLogger('debug');

//
async function dothething() {
    const filename = await askForFilename();
    const accounts = await readInAccounts(filename);
    const accountName = await askAboutAccountNameToOutput();
    outputAccounts(accountName, accounts);
}
dothething();