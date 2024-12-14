function Stacker() {
    const EMPTY = 0,
          WALL = 1,
          BLOCK = 2,
          GOLD = 3;

    const mapTracker = new MapTracker();

    function canMove(direction) {
        let targetCell;
        switch(direction) {
            case "left":
                targetCell = mapTracker.getCurrentCell().left;
                break;
            case "right":
                targetCell = mapTracker.getCurrentCell().right;
                break;
            case "up":
                targetCell = mapTracker.getCurrentCell().up;
                break;
            case "down":
                targetCell = mapTracker.getCurrentCell().down;
                break;
        }

        // Can't move into walls
        if (targetCell.type === WALL) return false;

        // Can't move if elevation difference is more than 1
        let currentLevel = mapTracker.getCurrentCell().level;
        let targetLevel = targetCell.level;
        if (Math.abs(currentLevel - targetLevel) > 1) return false;

        return true;
    }

    this.turn = function(cell) {
        // Update our knowledge of the map
        mapTracker.updateKnownMap(cell);

        // Print current map state
        console.log("Current map:");
        console.log(mapTracker.drawMap());
        console.log("Carrying block:", mapTracker.isCarrying());
        console.log("Current level:", cell.level);

        // Make a move
        let move = decideMove();
        
        // Only update map state if move is valid and successful
        if (["left", "right", "up", "down"].includes(move)) {
            if (canMove(move)) {
                mapTracker.shiftMap(move);
            } else {
                console.log(`Move ${move} was blocked!`);
                // Should probably choose a different move here
                move = "pickup"; // or some other fallback move
            }
        } else if (move === "pickup") {
            mapTracker.setCarrying(true);
        } else if (move === "drop") {
            mapTracker.setCarrying(false);
        }

        return move;
    }

    function decideMove() {
        // For now, still random
        let n = Math.random() * 6 >> 0;
        if (n == 0) return "left";
        if (n == 1) return "up";
        if (n == 2) return "right";
        if (n == 3) return "down";
        if (n == 4) return "pickup";
        if (n == 5) return "drop";
    }
}