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
    }while (!answer.includes("json") && !answer.includes("csv") && !answer.includes("xml"));
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
    logger.debug(row[fromAccount] + " is paying " + row[toAccount]);
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

async function readInXML(filename) {
    var XmlParser = require("xmljs");
    var fs = require("fs");


    var p = new XmlParser({ strict: true });
    var xml = fs.readFileSync(filename); // XML in the examples direct
    let accountInfo = 0;
    p.parseString(xml, function(err, xmlNode) {
        if(err) {
            console.error(err);
            return;
        }
        accountInfo = xmlNode.children["TransactionList"][0].children["SupportTransaction"];
    });
    let accounts = [];
    for (let index = 0; index < accountInfo.length; index++) {
        // date under attributes, Date
        // narrative under children, description
        // amount under children, value
        // to under children parties, to
        // from under children, parties, from
        const tmpAccountInfo = accountInfo[index];
        const tmp = {Date: tmpAccountInfo.attributes["Date"]["text"], Narrative: tmpAccountInfo.children["Description"][0]["text"], To: tmpAccountInfo.children["Parties"][0].children["To"][0]["text"], From: tmpAccountInfo.children["Parties"][0].children["From"][0]["text"], Amount: tmpAccountInfo.children["Value"][0]["text"]};
        accounts = parseData(tmp, "To", "From", accounts);
    }
    return accounts;
}

async function readInAccounts(filename) {
    if (filename.includes("csv")) {
        return await readInCSV(filename);
    } else if (filename.includes("json")) {
        return readInJSON(filename);
    } else {
        return await readInXML(filename);
    }
}

const logger = log4js.getLogger('debug');

async function startProgram() {
    const filename = await askForFilename();
    const accounts = await readInAccounts(filename);
    const accountName = await askAboutAccountNameToOutput();
    outputAccounts(accountName, accounts);
}
startProgram();