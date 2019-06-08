// TicTacToe API
// in the positions and get a move in return:
//
//
class TicTacToe {
    constructor(set) { 
        // if set when instantiating a class:
        // set the computer player character (me)
        // set the difficulty level: 0 - easy, 1 - normal, 2- impossible
        // set the response delay to simulate the human response time
        let settings = {
            me: 'o',
            difficulty: 2,
            delay: 900
        };

        let errResponse = {
            settings: "settings argument is not passed in as an object!",
            difficulty: "Difficulty values can range from 0 - 2",
            me: "Characters can only be set as 'x' or 'o' - lowercase.",
            delay: "Delay can only be set as an integer"
        };

        // if settings are defined at instantiation
        
        // define winning combinations
        const winCombo = [
            [1,2,3],
            [4,5,6],
            [7,8,9],
            [1,4,7],
            [2,5,8],
            [3,6,9],
            [1,5,9],
            [3,5,7]
        ];

    }

    // Set the difficulty of the computer.
    // difficulty can be set as 0 = easy
    //                          1 = normal
    //                          2 = impossible
    set settings(settings) {
        if(typeof settings === "object") {
            this.settings = {...this.settings, settings }
        } else {
            let err = new Error(errResponse.settings);
            throw(err);
        }
    }
    set difficulty (val) {
        if (difficulty < 3 && difficulty >= 0) {
            this.settings.difficulty = difficulty;
        } else {
            let err = new Error(errResponse.difficulty);
            throw(err);
        }
    }
    set character (arg) {
        if (character === 'x' || character === 'o') {
            this.settings.me = arg;
        } else {
            let err = new Error(errResponse.character);
            throw(err);
        }
    }


    /* 
        takes in an object as an Argument:
        [
            "","","",
            "","x","",
            "o","",""
        ]
    */ 
    move (positions) {
        const { me, difficulty} = this.settings;
        const rand = Math.floor(Math.random());
        const opponent = (me === 'o') ? 'x' : 'o';
        let newPositions = [...positions];
        let takeField; // int

        const possibleMoves = positions.filter(x=>x !== "");
        // if computer starts the game
        if (possibleMoves.length === 9) {
            takeField = (difficulty === 0) ? rand*8 : 4;
            newPositions[takeField] = me;
        } else {
            
        }

        setTimeout(()=>{ return newPositions; },this.settings.delay);
    }


}