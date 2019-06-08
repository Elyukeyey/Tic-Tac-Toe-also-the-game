//@ts-check
/*
 TicTacToe API
 
    1. takes in an object as an Argument:
    [
        "","","",
        "","x","",
        "o","",""
    ]

    2. Responds with an object: 
    {
        status: play / win / lose / tie
        newState: ["","x","o",...];
        prevState: ["","x","",...];
    }

    Rejects if passed wrong arguments:
        - length === 9
        - other characters than "", "o" or "x" present
        - all fields taken
        - wrong turn order


*/ 
class TicTacToe {
    /**
     * @param {any} set
     */
    constructor(set) { 
        this.settings = {
            me: 'o',
            difficulty: 2,
            delay: Math.round(400 + Math.random()*400)
        };

        if(set) {
            this.settings = {
                ...this.settings,
                set
            };
            if(set.delay) {
                this.settings.delay = Math.round((set.delay/2) + Math.random()*(set.delay/2));
            }
        }

        this.errResponse = {
            settings: "settings argument is not passed in as an object!",
            difficulty: "Difficulty values can range from 0 - 2",
            me: "Characters can only be set as 'x' or 'o' - lowercase.",
            delay: "Delay can only be set as an integer",
            chars: "Invalid characters present in array!",
            arrLength: "Invalid array length!"
        };

        // if settings are defined at instantiation
        
        // define winning combinations
        this.winCombo = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        this.corners = [0,2,6,8];
        this.edges = [1,3,5,7];
        this.center = 4;

        this.currentFields = ['','','','','','','','',''];
        this.history = new Array([this.currentFields]);
        

    }
    // <SETTERS>
    // Set the difficulty of the computer.
    // difficulty can be set as 0 = easy
    //                          1 = normal
    //                          2 = impossible
    /**
     * @param {any} set
     */
    set Settings(set) {
        if(typeof set === "object") {
            this.settings = {...this.settings, set };
            if(set.delay) {
                this.settings.delay = Math.round((set.delay/2) + Math.random()*(set.delay/2));
            }
        } else {
            throw(new Error(this.errResponse.settings));
        }
    }
    /**
     * @param {number} val
     */
    set Difficulty (val) {
        if (val < 3 && val >= 0) {
            this.settings.difficulty = val;
        } else {
            let err = new Error(this.errResponse.difficulty);
            throw(err);
        }
    }
    /**
     * @param {string} arg
     */
    set CompCharacter (arg) {
        if (arg === 'x' || arg === 'o') {
            this.settings.me = arg;
        } else {
            let err = new Error(this.errResponse.me);
            throw(err);
        }
    }
    set Delay (val) {
        if (val < 1500 || val >= 0) {
            this.settings.userDelay = val;
        } else {
            throw(new Error('Invalid value for delay: must be between 0 and 1500'));
        }
    }
    //</SETTERS>


    // <GETTERS>
    get Settings () {
        return { ...this.settings };
    }
    get History () {
        return { history: [...this.history] };
    }
    get currentState () {
        return { currentState: [...this.currentFields] };
    }
    // returns an object { winner: 'x', combo: [0,1,2]}
    get gameOver () {
        let winner = '';
        let fields = [];
        
        let x = this.currentFields.map((e,i)=>{
            if (e==='x') {
                return i;
            } else {
                return null;
            }
        })
        .filter(y=>y!==null);
                
        let o = this.currentFields.map((e,i)=>{
            if (e==='o') {
                return i;
            } else { 
                return null;
            }
        })
        .filter(y=>y!==null);
        
        for (let i = 0; i < this.winCombo.length; i++) {
            if(this.winCombo[i].filter(y=>x.includes(y)).length === 3) {
                winner = 'x';
                fields = this.winCombo[i];
            }
            if(this.winCombo[i].filter(field=>o.includes(field)).length === 3) {
                winner = 'o';
                fields = this.winCombo[i];
            }
        }

        // if no winners check the game field for possible moves
        if(!winner && this.currentFields.filter(x=>x==='').length === 0) {
            return { winner: 'tie', fields};
        }

        return { winner, fields }
    }


    //</GETTERS>

    // <private functions>
    /**
     * @param {any[]} array
     * @param {string} compare
     */
    _getValues (array,compare) {
        let arr = [];
        for (let i = 0; i < array.length; i++) {
            if(array[i] === compare) {
                arr = [...arr, i];
            }
        }
        return arr;
    }

    _checkWin (positions,player) {
        let playerPositions = positions.filter(x=>x===player);

        let win = this.winCombo.map(e=>{
            if(playerPositions.filter(x=>e.includes(x)).length === 3) {
                return true;
            }
            return false;
        })
        .filter(x=>x===true);

        if (win) {
            return true
        }
        return false;
    }

    /**
     * @param {number} num
     */
    _rand (num) { return Math.floor(Math.random()*num); }

    /**
     * @param {string[]} arr
     */
    _pushHistory (arr) {
        if(typeof arr !== 'object') {
            throw(new Error('Error: argument not a valid type!'));
        }

        for (let i = 0; i < this.history.length; i++) {
            if(this.history[i].length === 9) {
                this.history.push([]);
                this.history[i+1].push(arr);
            } else {
                this.history[i].push(arr);
            }
        }
    }
    //</private functions>


    /**
     * @param {any[]} positions
     */
    move (positions) {
        const start = performance.now();
        // immutables
        const { me, difficulty} = this.settings;
        const { chars, arrLength } = this.errResponse;
        const opponent = (me === 'o') ? 'x' : 'o';

        // map positions and moves
        const openMoves = this._getValues(positions,"");
        const myFields = this._getValues(positions,me);
        const opponentFields = this._getValues(positions,opponent);


        //  <ERRORS>
        // Handle possible errors:
        let err = { check:false };

        // if the field length !== 9
        if(positions.length !== 9) {
            err = {
                check: true,
                message: arrLength
            };
        }
        if(typeof positions !== 'object') {
            err = {
                check: true,
                message: 'Only accepts array arguments!'
            }
        }
        // wrong characters present
        if(positions.filter(x=>/[^o|x]/.test(x)).length !== 0) {
            err = {
                check: true,
                message: chars
            };
        }
        // if the game has already ended and all fields are taken
        if(positions.filter(x=>x===me).length + positions.filter(x=>x===opponent).length === 9) {
            err = {
                check: true,
                message: 'All fields already taken!'
            };
        } else if((positions.filter(x=>x===me).length - positions.filter(x=>x===opponent).length + 1) >= 2 || (positions.filter(x=>x===opponent).length - positions.filter(x=>x===me).length + 1) >= 3) {
            // Wrong turn order: if computer or player goes twice in a row.
            err = {
                check: true,
                message: 'Wrong turn order!'
            };       
        }
        // End of error handling.
        //  </ERRORS>

        let newPositions = [...positions];
        let takeField; // int

        // if computer starts the game;
        if (openMoves.length === 9) {
            takeField = (difficulty === 0) ? this._rand(9) : 4;
            newPositions[takeField] = me;
        } 

        // <main logic>:
        else {
            // check win possibility, else
            // iterate through opponent options and rank based on
            // a threat matrix (LOL)
            let winFields = this.winCombo.map((combo) => {
                if (combo.filter(x=>myFields.includes(x)).length > 0 && combo.filter(x=>opponentFields.includes(x)).length === 0) {
                    return {
                        combo: combo,
                        moves: combo.filter(x=>myFields.includes(x)).length,
                        fields: combo.filter(x=>!myFields.includes(x))
                    };
                } else {
                    return null
                }
            })
            .filter(x=>x!==null); // only return the ones with the possibility to win the game
            if(winFields.filter(({moves})=>moves > 1).length > 0) {
                // go for win move, if more options pick random one:
                let moves = [...winFields.filter(({moves})=>moves > 1).map(({fields})=>fields[0])];
                takeField = moves[this._rand(moves.length)];
                console.log('my win move: ' + takeField);
            // else go on defense:
            } else {

                let threatMatrix = this.winCombo.map((combo)=>{
                    if(opponentFields.filter(x=>combo.includes(x)).length > 0 && myFields.filter(x=>combo.includes(x)).length === 0) {
                            return {
                                combo: combo,
                                threat: combo.filter((x)=>opponentFields.includes(x)).length,
                                fields: combo.filter((x)=>!opponentFields.includes(x))
                            };
                        } else {
                            return null
                        }
                })
                .filter(x=>x!==null);

                let threats = threatMatrix.filter(({threat})=>threat===2);

                if(threats.length > 0) {
                    takeField = [...threats.map(({fields})=>fields[0])][0];
                // else if no imminent threats this round
                } else {
                // check the possible next moves for danger by 
                let futureThreats = [].concat(...threatMatrix.filter(({threat})=>threat === 1)
                                                    .map(({fields})=>fields))
                            .filter((x,i,arr)=>arr.indexOf(x)!==i)

                // and cross-reference it for future win posibilities.
                let futureGains = [].concat(...winFields.filter(({moves})=>moves===1)
                                                        .map(({fields})=>fields))
                            .filter((x)=>futureThreats.includes(x));

                    if(futureThreats.length > 0) {
                        //console.log('more threats than I can handle...');
                        //<more threats move>
                        let cornerPlay = futureThreats.filter(x=>this.corners.includes(x)).filter(x=>!this.edges.includes(x));

                        let openEdges = openMoves.filter(x=>this.edges.includes(x));
                        let openCorners = openMoves.filter(x=>this.corners.includes(x));
                        
                        if (cornerPlay.length === 1) {
                            // player goes for the corners
                            takeField = futureGains[this._rand(futureGains.length)] 
                        } else if (futureThreats.length === 4) { 
                            // player goes asymetric
                            takeField = openCorners[this._rand(openCorners.length)];
                        } else {
                            // rest of the cases
                            takeField = openEdges[this._rand(openEdges.length)]; 
                        }
                        //</more threats move>
                    } else if (openMoves.includes(4)) { // go for the center if at all possible
                        //console.log('taking center ...');
                        takeField = 4;
                    } else {
                        console.log('taking corners ...');
                        let moves = (openMoves.length === 8) ? this.corners : openMoves;
                        takeField = moves[this._rand(moves.length)];
                    }
                }
            }

        }
       // console.log(takeField);
        newPositions[takeField] = me;
        // </ main logic >

        // <Response object>
        let answer = {
            prevState: positions,
            newState: newPositions,
        };
        this._pushHistory(newPositions);
        this.currentFields = newPositions;
        // </Response object>
        
        // Create a delayed response:
        const res = new Promise((resolve,reject)=>{
            setTimeout(()=>{
                (!err.check) ? resolve(answer) : reject(err.message);
            },this.settings.delay);
        });
        console.log(`iterate through move: ${performance.now()-start}ms + ${this.settings.delay} delay`);
        // return answer
        return res;
    }
}

export default TicTacToe;