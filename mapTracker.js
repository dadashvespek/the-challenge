class MapTracker {
    constructor() {
        this.knownCells = new Map(); // Key: "x,y", value: {type, level}
        this.carrying = false;
        this.currentCell = null;
    }

    coordKey(x, y) {
        return `${x},${y}`;
    }

    updateKnownMap(cell) {
        // Store current cell
        this.knownCells.set(this.coordKey(0, 0), {
            type: cell.type,
            level: cell.level
        });

        // Store adjacent cells
        this.knownCells.set(this.coordKey(-1, 0), {
            type: cell.left.type,
            level: cell.left.level
        });
        this.knownCells.set(this.coordKey(1, 0), {
            type: cell.right.type,
            level: cell.right.level
        });
        this.knownCells.set(this.coordKey(0, -1), {
            type: cell.up.type,
            level: cell.up.level
        });
        this.knownCells.set(this.coordKey(0, 1), {
            type: cell.down.type,
            level: cell.down.level
        });

        this.currentCell = cell;
    }

    shiftMap(direction) {
        let newMap = new Map();
        
        for (let [key, value] of this.knownCells) {
            let [x, y] = key.split(',').map(Number);
            
            switch (direction) {
                case "left":
                    x += 1;
                    break;
                case "right":
                    x -= 1;
                    break;
                case "up":
                    y += 1;
                    break;
                case "down":
                    y -= 1;
                    break;
            }
            
            if (x !== 0 || y !== 0) {
                newMap.set(this.coordKey(x, y), value);
            }
        }
        
        this.knownCells = newMap;
    }

    getKnownCell(relX, relY) {
        return this.knownCells.get(this.coordKey(relX, relY));
    }

    setCarrying(isCarrying) {
        this.carrying = isCarrying;
    }

    isCarrying() {
        return this.carrying;
    }

    getCurrentCell() {
        return this.currentCell;
    }

    drawMap() {
        // Find map boundaries
        let minX = 0, maxX = 0, minY = 0, maxY = 0;
        for (let key of this.knownCells.keys()) {
            let [x, y] = key.split(',').map(Number);
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }

        // Create the map string with aligned grid
        let mapString = '';
        
        // Add top border
        mapString += '+' + '----+'.repeat(maxX - minX + 3) + '\n';
        
        for (let y = minY - 1; y <= maxY + 1; y++) {
            mapString += '|'; // Left border
            for (let x = minX - 1; x <= maxX + 1; x++) {
                let cell = this.getKnownCell(x, y);
                if (x === 0 && y === 0) {
                    mapString += ` @${this.currentCell.level} `; // Current position with level
                } else if (!cell) {
                    mapString += '    '; // Unknown
                } else {
                    switch (cell.type) {
                        case 0: mapString += ` .${cell.level} `; break; // EMPTY
                        case 1: mapString += ` #${cell.level} `; break; // WALL
                        case 2: mapString += ` B${cell.level} `; break; // BLOCK
                        case 3: mapString += ` G${cell.level} `; break; // GOLD
                        default: mapString += ' ?? ';
                    }
                }
                mapString += '|'; // Cell border
            }
            mapString += '\n';
            // Add horizontal border between rows
            mapString += '+' + '----+'.repeat(maxX - minX + 3) + '\n';
        }
        
        return mapString;
    }
}