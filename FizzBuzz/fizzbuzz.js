var i;
for (i=1; i<=100; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        console.log("FizzBuzz");
    } else if (i % 3 == 0) {
        console.log("Fixx");
    } else if (i % 5 == 0) {
        console.log("Buxx");
    } else {
        console.log(i);
    }
}