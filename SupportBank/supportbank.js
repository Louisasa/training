const log4js = require('log4js');
const csv = require('csv-parser');
const XmlParser = require("xmljs");

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
    } while (!answer.includes("json") && !answer.includes("csv") && !answer.includes("xml"));
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

async function askToExport() {
    let answer = await question("Would you like to export? Y/N ");
    return answer.toUpperCase() === "Y";
}

// function parseData(row, toAccount, fromAccount, accounts) {
//     // date
//     // from
//     // to
//     // narrative
//     // amount
//
//     // check that user has account if not init
//     // look up account, add transaction
//     logger.debug(row[fromAccount] + " is paying " + row[toAccount]);
//     logger.debug(row["Amount"]);
//     logger.debug(row["Date"]);
//     if (!(row[fromAccount] in accounts)) {
//         accounts[row[fromAccount]] = {account: new Account(row[fromAccount], 0)};
//     }
//     accounts[row[fromAccount]].account.transaction(parseInt(row["Amount"]) * -1, row["Narrative"], row["Date"]);
//     if (!(row[toAccount] in accounts)) {
//         accounts[row[toAccount]] = {account: new Account(row[toAccount], 0)};
//     }
//     accounts[row[toAccount]].account.transaction(parseInt(row["Amount"]), row["Narrative"], row["Date"]);
//     return accounts;
// }

function ensureAccountExists(accounts, name) {
    accounts[name] = accounts[name] || new Account(name, 0);
}

function parseData({Date, Narrative, Amount}, from, to, accounts) {
    ensureAccountExists(accounts, from);
    ensureAccountExists(accounts, to);
    accounts[from].transaction(parseInt(Amount) * -1, Narrative, Date);
    accounts[to].transaction(parseInt(Amount), Narrative, Date);
    return accounts;
}

function outputAccounts(name, accounts) {
    if (name.length < 1) {
        for (let accountName in accounts) {
            const tmpAccount = accounts[accountName];
            console.log(accountName + ": " + tmpAccount.getAmount())
        }
    } else {
        console.log(name);
        if (name in accounts) {
            console.log(accounts[name].getTransactions());
        } else {
            console.log("Name does not have an account");
        }

    }
}

async function readInCSV(filename) {
    logger.debug("Started running");
    let accounts = {};
    return new Promise((res, rej) => {
        fs.createReadStream(filename)
            .pipe(csv())
            .on('data', (row) => {
                accounts = parseData(row, "To", "From", accounts);
            })
            .on('end', () => res(accounts));
    });
}

function readInJSON(filename) {
    logger.debug("Started running");

    let rawdata = fs.readFileSync(filename);
    const file = JSON.parse(rawdata);
    let accounts = [];
    for (let index = 0; index < file.length; index++) {
        accounts = parseData(file[index], "ToAccount", "FromAccount", accounts);
    }
    return accounts;
}

async function readInXML(filename) {
    const parser = new XmlParser({strict: true});
    const xml = fs.readFileSync(filename); // XML in the examples direct
    const transactions = await new Promise(((resolve, reject) => {
        parser.parseString(xml, (err, xmlNode) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(xmlNode.children["TransactionList"][0].children["SupportTransaction"]);
            }
        });
    }));
    let accounts = [];
    transactions.map((transaction) => {
        const parties = transaction.children.Parties[0];
        return {
            Date: transaction.attributes.Date.text,
            Narrative: transaction.children.Description[0].text,
            To: parties.children["To"][0]["text"],
            From: parties.children["From"][0]["text"],
            Amount: transaction.children["Value"][0]["text"]
        };
    }).forEach((transaction) => {
        accounts = parseData(transaction, transaction.To, transaction.From, accounts);
    });
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

function exportToFile(accounts) {
    let data = JSON.stringify(accounts);
    fs.writeFileSync('accounts.json', data);
}

const logger = log4js.getLogger('debug');
const fs = require('fs');

async function startProgram() {
    const filename = await askForFilename();
    const accounts = await readInAccounts(filename);
    const accountName = await askAboutAccountNameToOutput();
    outputAccounts(accountName, accounts);
    const exportBool = await askToExport();
    if (exportBool) {
        // todo: what type of export
        console.log("Finished exporting");
    }
}

startProgram();