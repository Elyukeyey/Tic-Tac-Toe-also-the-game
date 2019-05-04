/*export const playerPositions = {
    x: [],
    o: []
};


export const startPosition = [
    {id: 1, taken: ''},
    {id: 2, taken: ''},
    {id: 3, taken: ''},
    {id: 4, taken: ''},
    {id: 5, taken: ''},
    {id: 6, taken: ''},
    {id: 7, taken: ''},
    {id: 8, taken: ''},
    {id: 9, taken: ''}
  ];*/

export const winCombinations = [
    [1,2,3],
    [4,5,6],
    [7,8,9],
    [1,4,7],
    [2,5,8],
    [3,6,9],
    [1,5,9],
    [3,5,7]
];


export const gameOver = (winCombinations, players) => {
    let results = {
        x: false,
        o: false,
        win: [],
        reset: false
    };
    for (let prop in players) {
        winCombinations.map(e => {
            if (players[prop].filter(x => e.includes(x)).length === 3) {
                results[prop] = true;
                results.win = [...players[prop].filter(x=> e.includes(x))];
                results.reset = true;
                return true;
            }
            return false;
        });
    }
    
    if((players.x.length + players.o.length) === 9) {
        //console.log('inside');                                                                        CL
        return {
            ...results,
            reset: true                     
        }
    }
    //console.log('outside: ' + results);
    return results
}

/*export function playField(x) {
    //console.log('i play field number: ' + x);
    // make a ref with id and programatically click it
}*/

export function playerAI(opponent,turn,moveNumber,takenFields,winCombinations) {
    // playerAI function called after human player move
    // so no need to check for move.
    let gameOverCheck = gameOver(winCombinations,takenFields);
    if(turn || gameOverCheck.win.length > 0) {
        return false;
    }

    // who am I and who is my opponent (xo)
    let me = (opponent === 'o') ? 'x' : 'o';

    // pick random field where logical to do so...
    const pickRandField = (x) => Math.floor(Math.random() * x);
    
    // return an object called nextPosition
    let nextPosition = {turn: me, yes:false};
    let possibleMoves = [];
    let checkMyWin = [], checkOpponentWin = [];
    
    switch(parseInt(moveNumber)) {
        case 1:
            // attacking: position at center or corners
            possibleMoves = [1,3,5,7,9];
            nextPosition = {...nextPosition, moveTo: possibleMoves[pickRandField(4)], yes: true}
            return nextPosition;
        case 2:
            //console.log('%cCASE 2','color: maroon; font-weight:bold;');                           CL
            // defending: move to center if possible, else corners

            // check if the middle is already taken
            if(takenFields[opponent][0] === 5) {
                possibleMoves = [1,3,5,7,9].filter(x => !takenFields[opponent].includes(x));
                nextPosition = {
                    ...nextPosition,
                    moveTo: possibleMoves[pickRandField(possibleMoves.length)],
                    yes: true
                }
                return nextPosition;
            
            // if middle is possible to take, move to middle
            } else {
                nextPosition = {...nextPosition, moveTo: 5, yes: true}
                return nextPosition;
            }
        case 3:
            // if attacking
            //console.log('case 3');                                                                CL

            break;
        case 4:
            //console.log('%cCASE 4:','color: orange; font-weight: bold');                          CL
            // if defending
            // check which win the oponent is trying to get and go between
            possibleMoves = winCombinations.map(e=> {
                if (e.filter(x=>!takenFields[opponent].includes(x).length > 1) || e.filter(x=>[...takenFields[me],...takenFields[opponent]].includes(x)).length === 3) {
                // return only the win array that the opponent is trying to reach
                return e.filter(x=>!takenFields[opponent].includes(x))
                } else {
                    return 0;
                }
            });
            //console.log(possibleMoves);                                                                   CL
            // since this only one possibility, filter the only one that returns
            let logicalMove = possibleMoves.filter(x=>x.length===1); 
            //console.log(logicalMove);                                                                     CL
            
            if(logicalMove.length < 1) {//if no immediate danger, but danger in the next round if left unchecked:
                                        // . . . 
                                        // . O X 
                                        // X . . 
                            logicalMove = [...possibleMoves.filter(x=>x.length===2)];
                            //console.log('logical Move before flat');                                      CL
                            //console.log(logicalMove);                                                     CL
                            console.log(logicalMove);
                            logicalMove = logicalMove
                                //.flat() - not supported by EDGE and IE
                                .concat.apply([],[...logicalMove])
                                .filter(x=>![...takenFields[me],...takenFields[opponent]].includes(x))
                                .filter(x=>![1,3,7,9].includes(x))
                                ; // exclude nonviable options // exclude duplicates
                console.log(logicalMove);
                let duplicate = logicalMove.filter((x,i)=>logicalMove.indexOf(x) !== i);
                //console.log('duplicate: ' + duplicate);                                                   CL
                //console.log('only possible move:')                                                        CL
                //console.log(logicalMove);                                                                 CL
                logicalMove = logicalMove.filter(x=>x!==parseInt(duplicate));
                console.log(logicalMove);
            }
 
            if(!takenFields[me].includes(parseInt(logicalMove))) { 
                if([2,4,6,8].filter(x=>!takenFields[opponent].includes(x)).length > 2) {
                    //console.log('logical move:')                                                          CL
                    //console.log(logicalMove);                                                             CL
                    nextPosition = {...nextPosition, moveTo: logicalMove, yes: true};
                } else {
                    //console.log('what now?');                                                             CL
                    logicalMove = //winCombinations.filter((e)=> e.filter(x=>!takenFields[opponent].includes(x)).length === 2)
                                    [...possibleMoves.filter(x=>x.length===2)]
                                                .concat.apply([],[...possibleMoves.filter(x=>x.length===2)])
                                                //.flat() - not supported by EDGE and IE
                                                .filter(x=>![...takenFields[me],...takenFields[opponent]].includes(x))
                                                .filter(x=>x % 2 !== 0)
                    nextPosition = {...nextPosition, moveTo: logicalMove, yes: true};
                }
                return nextPosition;
            //
            } else if (takenFields[me].includes(5)) { // If I am in the middle, go on offensive
                // Here lies the problem - *** problem solved
                // Bad idea moving on 2 4 6 8,
                // but what if you don't have a choice?
                let logicalMoves = [2,4,6,8].filter(x=>![...takenFields[me], ...takenFields[opponent]].includes(x)); // move anywhere but here
                //console.log('does not respect copyrights:');                                              CL
                //console.log(logicalMoves);                                                                CL
                nextPosition = {...nextPosition,
                    moveTo: parseInt(logicalMoves[pickRandField(logicalMoves.length)]),
                    yes: true
                }
                return nextPosition;
                // move logic
            } else { // else if I am not in the middle
                //
                //console.log('doesnt include five but is below it:');                                      CL
                let illogicalMoves = [2,4,6,8, ...takenFields[me], ...takenFields[opponent]].sort(); // do not move here

                let logicalMoves = possibleMoves.filter(x=>x.length===3) //set the logical moves by filtering an array where the oponent has the best win options
                                                .concat.apply([],[...possibleMoves]) // flatten the array, since it's a deep array, made out of two arrays .flat() does not yet work with EDGE or IE
                                                //.flat()
                                                .filter(x=>!illogicalMoves.includes(x)); // then filter that array with the illogical move options
                
                

                // take the logical move and the current position and check it against a win option
                //if the opponent is already present on that path, forget it.

                // what is left are  the logical move options, pick any of them with random method 
                nextPosition = {...nextPosition,
                    moveTo: logicalMoves[pickRandField(logicalMoves.length)],
                    yes: true
                }
                return nextPosition;

            }
            // if I can get the upper hand I will get it
        case 5:
        break;
        case 6:
        
        //console.log('%cCASE 6:','color: green; font-weight: bold');                                               CL
        // case six logical move, case six logical alternative move
        let cSixLogicalMove = [], cSixLogicalMoveAlternative = [];
        
        // check my win options in this move
            possibleMoves = winCombinations.map(e => {
                // if I have 2 of the three winning combinations, and if the opponent isn't on the third.
                if(e.filter(x=>takenFields[me].includes(x)).length === 2 && e.filter(x=>[...takenFields[me], ...takenFields[opponent]].includes(x)).length !== 3) {
                    cSixLogicalMove = e.filter(x=>!takenFields[me].includes(x));
                    nextPosition = { ...nextPosition, 
                        moveTo: cSixLogicalMove[0],
                         yes: true
                    }
                    return e.filter(x=>!takenFields[me].includes(x))[0];
                } else {
                    return 0;
                }
            });   
            // if I can win, do the move.
            if (cSixLogicalMove.length > 0) {
                return nextPosition;

            // if there are no options for win, stop the opponent from winning - if only one option exists, if more do, you lose anyway
            } else {
                console.log('im hiding in the else ...');
                 winCombinations.map(e => {
                    if(e.filter(x=>takenFields[opponent].includes(x)).length === 2 && e.filter(x=>[...takenFields[me], ...takenFields[opponent]].includes(x)).length !== 3) {
                        cSixLogicalMoveAlternative = e.filter(x=>!takenFields[opponent].includes(x));
                        nextPosition = { ...nextPosition,
                        moveTo: e.filter(x=>!takenFields[opponent].includes(x))[0],
                        yes: true
                        }
                        return e.filter(x=>takenFields[opponent].includes(x))[0];
                    } else {
                        return 0;
                    }
                });
                if(cSixLogicalMoveAlternative.length > 0) {
                    return nextPosition;
                } else {
                    // if nothing else check the only other win option - middle level:
                    // . X .
                    // . O .
                    // X O X
            // Danger level:
            // X 2 3 <--- move to 3 (best defense is a good offense) 
            // O O X
            // 7 X 9 <--- 7 or 9
                    console.log('this is my move ...');
                    //cSixLogicalMove = [1,3,5,7,9].filter(x=>![...takenFields[me],...takenFields[opponent]].includes(x));
                    cSixLogicalMove = [1,2,3,4,5,6,7,8,9].filter(x=>![...takenFields[me],...takenFields[opponent]].includes(x));
                    nextPosition = {
                        ...nextPosition,
                        moveTo: cSixLogicalMove[pickRandField(cSixLogicalMove.length)],
                        yes: true
                    }
                }
                
            }
            return nextPosition;
        case 7:
        break;
        case 8:
        
        console.log('%cCASE 8:','color: blue; font-weight: bold');
            // check if I can win
            checkMyWin = winCombinations.map(e=> {
                if(e.filter(x=>[...takenFields[me]].includes(x)).length === 2 && e.filter(x=>[...takenFields[me],...takenFields[opponent]].includes(x)).length !== 3) {
                    let winEight = e.filter(x=>!takenFields[me].includes(x))[0];
                    nextPosition = {
                        ...nextPosition,
                        moveTo: winEight,
                        yes: true
                    }
                    return e;
                } else {
                    return 0;
                }
            });
            if(checkMyWin.filter(x=>x !== 0).length > 0) {
                return nextPosition
            } else {
                checkOpponentWin = winCombinations.map(e=> {
                    if(e.filter(x=>[...takenFields[opponent]].includes(x)).length === 2 && e.filter(x=>[...takenFields[me],...takenFields[opponent]].includes(x)).length !== 3) {
                        let winEight = e.filter(x=>!takenFields[opponent].includes(x))[0];
                        nextPosition = {
                            ...nextPosition,
                            moveTo: winEight,
                            yes: true
                        }
                        return winEight;
                    } else {
                        return 0;
                    }
                });
            }
            if (checkMyWin.filter(x=> x !== 0).length === 0 && checkOpponentWin.filter(x=>x !== 0).length === 0) {
                possibleMoves = [1,2,3,4,5,6,7,8,9].filter(x=>![...takenFields[me],...takenFields[opponent]].includes(x));
                nextPosition = {
                    ...nextPosition,
                    moveTo: possibleMoves[(pickRandField(possibleMoves.length))],
                    yes: true
                }
            }
            return nextPosition;
            // check if opponent can win
            
            //return nextPosition;
        default:
            console.log('Game should restart ...');
    }
    return 
}