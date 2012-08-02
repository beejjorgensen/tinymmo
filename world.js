var map=[], maxX=40, maxY=20;

exports.map = map;

var item = {
  EMPTY:' ',
  WALL: '#',
  TRAP: 'v',
  GOLD: '$'
};

exports.isEmpty = function(x,y) {
  return map[y][x] === item.EMPTY;
};

exports.setStartPosition = function(player) {
  for (var i=0; i<1000; i++) {
    var x = randX(),
        y = randY();
    if (exports.isEmpty(x,y)) {
      player.x = x;
      player.y = y;
      return;
    }
  }
  throw "Could not find empty cell on map";
};

function randX() { return Math.round(Math.random() * maxX); }
function randY() { return Math.round(Math.random() * maxY); }

function chooseCell(x,y) {
  if ( x===0 || x===maxX || y===0 || y===maxY ) return item.WALL;
  if (Math.random() > 0.97) return item.TRAP;
  if (Math.random() > 0.97) return item.GOLD;
  return item.EMPTY;
}

// init
for (var y = 0; y <= maxY; y++) {
  map[y]=[];
  for (var x = 0; x <= maxX; x++) {
    map[y][x] = chooseCell(x,y);
  }
}


