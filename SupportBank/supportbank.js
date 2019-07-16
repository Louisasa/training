// const readline = require('readline');
//
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
//
// var question = function(q) {
//     return new Promise( (res, rej) => {
//         rl.question( q, answer => {
//             res(answer);
// })
// });
// };
//
// async function question1() {
//     let answer = await question('Would you like to turn off rules? Y/N ');
//     if (answer === "yes") {
//         await question2();
//     }
//     doRules();
// }
//
// async function question2() {
//     let answer1;
//     while (answer1 != "Y" && answer1 != "N") {
//         answer1 = await question('Would you like to turn on the fizz rule? Y/N ');
//     }
//     if (answer1 === "Y") {
//         questionList.push(fizzRule);
//     }
//
// }
//
// const questionList = [];
//
// question1();


const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('Transactions2014.csv')
    .pipe(csv())
    .on('data', (row) => {
    console.log(row);
})
.on('end', () => {
    console.log('CSV file successfully processed');
});