var map=[], maxX=40, maxY=20;

var item = {
  EMPTY:' ',
  WALL: '#',
  TRAP: 'v',
  GOLD: '$'
};

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

exports.map = map;
exports.item = item;
exports.maxX = maxX;
exports.maxY = maxY;
