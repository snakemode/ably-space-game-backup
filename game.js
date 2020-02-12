const allMoves = require("./gameMoves");
const numberOfMinutesPerGame = 1;

class Game {
    constructor(playerId, onGameStateChanged = this.__errorThrowingStateChangeHandler, moves) {
        this.id = this.__uuidv4();
        this.playerId = playerId;
        this.moves = moves || this.__generateMoves(10);
        this.expires = new Date(Date.now() + ((1000 * 60) * numberOfMinutesPerGame));
        
        this.onGameStateChanged = onGameStateChanged;
        this.onGameStateChanged(this.status());
    }

    handleMove(element, state, extraParams) {
        let activeMoveId = this.activeMoveId();
        let currentMove = this.getMove(activeMoveId);        
        const moveResult =  currentMove.succeedsWhen(element, state, extraParams);

        if (moveResult !== true) {
            return this.status(moveResult);
        }
        
        this.markCurrentMoveAsCompleted();

        if (this.gameIsFinished()) {
            return this.status();
        }

        activeMoveId = this.activeMoveId();
        currentMove = this.getMove(activeMoveId);

        this.onGameStateChanged(this.status());

        return this.status();       
    }

    status(lastMoveResultSuccess = true) {      
        return { 
            id: this.id, 
            gameState: this.moves.length > 0 ? "active" : "complete", 
            remainingTasks: this.moves.length, 
            hint: this.moves.length > 0 ? this.getMove(this.activeMoveId()).hint() : "",
            lastMoveSuccessful: lastMoveResultSuccess,
            playerId: this.playerId,
            gameEnds: this.expires
        }
    }

    gameIsFinished() { return this.moves.length === 0; }
    markCurrentMoveAsCompleted() { this.moves.pop(); }
    activeMoveId() { return this.moves[this.moves.length-1]; }
    getMove(moveId) { return allMoves[moveId]; }
  
    __generateMoves(numberOfMovesToGenerate) {
        const moves = [];
        for (let i = 0; i < numberOfMovesToGenerate; i++) {
            const randomMove = this.__random(0, allMoves.length);
            moves.push(randomMove);
        }
        return moves;
    }

    __uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
  
    __errorThrowingStateChangeHandler(gameState) { throw new Error("No onGameStateChanged handler provided. Cannot notify player of next task!"); }
    __random(start, end) { return Math.floor((Math.random() * end) + start); }

}

module.exports = Game;