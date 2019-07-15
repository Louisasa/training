var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    console.log("you entered: [" +
        d.toString().trim() + "]");
});

// let i;
// for (i=0; i<=147; i++) {
//     let outputArray = [];
//
//     // 3 = Fizz
//     // 5 = Buzz
//     // 7 = Bang
//     // 11 = Bong ONLY
//     // 13 = Fezz but before Bs (including 11)
//     // 17 = reverse order
//     if (i % 3 === 0 && !(i % 11 === 0)) {
//         outputArray[outputArray.length] = "Fizz";
//     }
//     if (i % 13 === 0) {
//         outputArray[outputArray.length] = "Fezz";
//     }
//     if (i % 5 === 0 && !(i % 11 === 0)) {
//         outputArray[outputArray.length] = "Buzz";
//     }
//     if (i % 7 === 0 && !(i % 11 === 0)) {
//         outputArray[outputArray.length] = "Bang";
//     }
//     if (i % 11 === 0) {
//         outputArray[outputArray.length] = "Bong";
//     }
//     if (i % 17 === 0) {
//         outputArray.reverse();
//     }
//     if (outputArray.length < 1) {
//         console.log(i);
//     } else {
//         let outputString = "";
//         for (let x = 0; x <outputArray.length; x++) {
//             outputString += outputArray[x];
//         }
//         console.log(outputString);
//     }
// }