function createMoves(numberOfMovesToGenerate, fromMoveSelection) {
    let moves = [];
    const switchStates = {};

    let lastMoveId = -1;
    for (let i = 0; i < numberOfMovesToGenerate; i++) {
        
        let randomMoveId = Math.floor((Math.random() * fromMoveSelection.length) + 0);
        if (moves.length > 1 && lastMoveId === randomMoveId) {
          while(lastMoveId === randomMoveId) {
            randomMoveId = Math.floor((Math.random() * fromMoveSelection.length) + 0);
          }
        }
      
        const actualMove = fromMoveSelection[randomMoveId]();

        ensureSwitchesAreConsistent(actualMove, switchStates);        
        moves.push(actualMove);
        lastMoveId = randomMoveId;
    }
    
    return moves;
}

function ensureSwitchesAreConsistent(actualMove, switchStates) {
  if (!actualMove) return;
  if (!actualMove.isSwitch) return;
  if (actualMove.isSwitch !== true) return;  
    
  if (!switchStates.hasOwnProperty(actualMove.elementId)) {
    switchStates[actualMove.elementId] = actualMove.target;    
  } else {    
    actualMove.target = !switchStates[actualMove.elementId];
    switchStates[actualMove.elementId] = actualMove.target;    
  }  
}

module.exports = createMoves;