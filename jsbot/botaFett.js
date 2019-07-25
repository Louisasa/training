class BotaFett {

    constructor() {
        this.oppositeDict = {};
        this.oppositeDict["R"] = "P";
        this.oppositeDict["P"] = "S";
        this.oppositeDict["S"] = "R";
        this.oppositeDict["D"] = "W";
        this.oppositeDict["W"] = "R";
        this.dynamiteCount = 100;
        this.moves = ["R", "P", "S", "W", "D"];
        this.markovChain = [[0.2, 0.2, 0.2, 0.2, 0.2],[0.2, 0.2, 0.2, 0.2, 0.2],[0.2, 0.2, 0.2, 0.2, 0.2],[0.2, 0.2, 0.2, 0.2, 0.2],[0.2, 0.2, 0.2, 0.2, 0.2]];
    }

    checkDynamiteSupply(suggestedMove) {
        if (suggestedMove === "D") {
            this.dynamiteCount--;
            if (this.dynamiteCount > 0) {
                return suggestedMove;
            } else {
                return "S";
            }
        }
        return suggestedMove;
    }

    analysisInconclusive(gamestate, length) {
        const lastMoves = gamestate.rounds[length-1];
        const suggestedMove = this.oppositeDict[lastMoves.p2];
        return this.checkDynamiteSupply(suggestedMove);
        return suggestedMove;
    }

    chooseMove(lastMove) {
        const ranFloat = Math.random();//generate a random float
        const indexOfMove = this.moves.indexOf(lastMove);
        if (ranFloat <= this.markovChain[indexOfMove][1]){//use that random float, along with our Markov Chain values of potential moves, to generate a probabilisically determined move
            return "P";//Note that the returned moves are, in fact, the counters to the move the AI predicts the user to perform
        } else if (ranFloat <= this.markovChain[indexOfMove][2] + this.markovChain[indexOfMove][1]){//We add these two values together here to properly model the possibility space
            return "S";
        } else if (ranFloat <= this.markovChain[indexOfMove][3] + this.markovChain[indexOfMove][2] + this.markovChain[indexOfMove][1]){
            return "W";
        } else if (ranFloat <= this.markovChain[indexOfMove][4] + this.markovChain[indexOfMove][3] + this.markovChain[indexOfMove][2] + this.markovChain[indexOfMove][1]){
            return "D";
        } else {
            return "R";
        }
    }

    updateMarkov(lastMove, newMove, gamestate) {
        // if(newMove === "R"){
        //     lastMove = 0;
        // }
        // else if(newMove === "P"){
        //     lastMove = 1;
        // }
        // else if(newMove === "S"){
        //     lastMove = 2;
        // }
        // else if(newMove === "W"){
        //     lastMove = 3;
        // }
        // else {
        //     lastMove = 4;
        // }
        // updating the Markov Chain
        /*
         * 1. Multiply everything in the appropriate column of the Markov Chain by timesPlayed[moveBeforeLast]
         * 2. Increment the row value we want (that is, markovChain[moveBeforeLast][lastMove] by one
         * 3. Increment timesPlayed[moveBeforeLast] by one
         * 4. Divide all values in markovChain[moveBeforeLast][x] by timesPlayed[moveBeforeLast]
         */
        const count = this.findTimesPlayed(newMove, gamestate);
        const indexOfMove = this.moves.indexOf(lastMove);
        const indexOfNewMove = this.moves.indexOf(newMove);
        for (let index = 0; index < 5; index++) {
            this.markovChain[indexOfMove][index] *= count;
        }

        for (let index = 0; index < 5; index++) {
            if (index === indexOfNewMove) {
                this.markovChain[indexOfMove][index] += 1;
            } else {
                this.markovChain[indexOfMove][index] -= 1;
            }
        }




        // //4. Divide all values in markovChain[moveBeforeLast][x] by timesPlayed[moveBeforeLast]
        for(let index = 0; index < 5; index++){
            this.markovChain[indexOfMove][index] /= count;
        }
    }

    findTimesPlayed(play, gamestate) {
        let count = 0;
        for (let index = 0; index < gamestate.rounds.length; index++) {
            if (gamestate.rounds[index].p2 === play) {
                count++;
            }
        }
        return count;
    }

    makeMove(gamestate) {
        const length = gamestate.rounds.length;
        let result;
        if (length<3) {
            result = this.chooseMove("P");
        } else {
            console.log("p2 "+ gamestate.rounds[length-1].p2);
            console.log("p1 "+ gamestate.rounds[length-1].p1);
            result = this.chooseMove(gamestate.rounds[length-1].p2);

            this.updateMarkov(gamestate.rounds[length-2].p2, gamestate.rounds[length-1].p2, gamestate);
        }
        // console.log(this.markovChain);
        // console.log("end");
        return this.checkDynamiteSupply(result);

    }

    // makeMove(gamestate) {
    //     const length = gamestate.rounds.length;
    //     if (length===0) {
    //         return "P";
    //     }
    //
    //     //get all previous goes by player
    //     //get the stats on what it is likely to choose after it's previous go
    //     //if inconclusive, call analysisInconclusive
    //
    //     //loop through previous goes
    //     //find all moves that have matched the previous go and map with the next go
    //     //divide by how every many goes there have been
    //     // if there is a result > 50% go for it's opposite
    //
    //     const lastMove = gamestate.rounds[length-1].p2;
    //     const nextMoveGuesses = {};
    //     for (let index = 0; index < length-1; index++) {
    //         const previousMove = gamestate.rounds[index].p2;
    //         if (previousMove === lastMove) {
    //             const moveAfter = gamestate.rounds[index+1].p2;
    //             if (nextMoveGuesses[moveAfter] !== undefined) {
    //                 nextMoveGuesses[moveAfter]++;
    //             } else {
    //                 nextMoveGuesses[moveAfter] = 1;
    //             }
    //         }
    //     }
    //
    //
    //     let currentMax = 0;
    //     let currentGuess = "";
    //     for (let nextGuess of this.moves) {
    //         if (nextMoveGuesses[nextGuess] !== undefined && nextMoveGuesses[nextGuess] >currentMax) {
    //             currentGuess = nextGuess;
    //             currentMax = nextMoveGuesses[nextGuess];
    //         }
    //     }
    //
    //     if (currentMax/length > 50) {
    //         return this.checkDynamiteSupply(this.oppositeDict[currentGuess]);
    //     } else {
    //         const move = this.moves[Math.floor(Math.random() * Math.floor(3))]
    //         const attempt = this.checkDynamiteSupply(move);
    //         return attempt;
    //         //return this.analysisInconclusive(gamestate, length);
    //     }
    // }
}

module.exports = new BotaFett();



