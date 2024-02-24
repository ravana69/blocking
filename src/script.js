let bimg;
let cellSize = 20;
let sizeRange = [3, 8];

let gw, gh;
let xOff, yOff;
let grid;

let rects = []
let emptys = [];

let hues = [0, 60, 240];

function Rect(x, y, w, h){
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  
  this.hue = random(hues);
  this.bal = random(40, 100);
  
  this.render = function(){
    push();
    translate(xOff + this.x*cellSize, yOff + this.y*cellSize);
    strokeWeight(cellSize*.15);
    fill(this.hue, 100, this.bal, .5);
    rect(0, 0, this.w*cellSize, this.h*cellSize);
    pop();
  }
}

function preload(){
  bimg = loadImage("https://s3-us-west-2.amazonaws.com/s.cdpn.io/964843/canvas.jpg");
}

function setup(){
  createCanvas();
  colorMode(HSB);
  // blendMode(ADD);
  windowResized();
}

function init(){
  rects = [];
  emptys = [];
  
  gw = floor(width/cellSize);
  gh = floor(height/cellSize);
  
  xOff = (width - gw*cellSize)/2;
  yOff = (height - gh*cellSize)/2;
  
  grid = [];
  for (var i = 0; i < gw; i++){
    grid.push([]);
    for (var j = 0; j < gh; j++){
      grid[i].push(true);
      emptys.push([i, j]);
    }
  }
}

function buildGrid(){
  let pos = random(emptys);
  if (!pos || !isEmpty(...pos)) return;

  let goal = [rInt(...sizeRange), rInt(...sizeRange)];
  let size = [0, 0];
  let len = dist(...pos, goal[0]+pos[0], goal[1]+pos[1]);

  for (var l = 0; l < len; l++){
    var emptyX = true;
    var emptyY = true;
    var x = floor(l*goal[0]/len);
    var y = floor(l*goal[1]/len);

    for (var i = 0; i <= x; i++) emptyY = emptyY && isEmpty(i + pos[0], y + pos[1]);
    for (var j = 0; j <= y; j++) emptyX = emptyX && isEmpty(x + pos[0], j + pos[1]);

    if (!emptyX || !emptyY){
      size = [x - (emptyX ? 0 : 1), y - (emptyY ? 0 : 1)];
      break;
    }
  }

  for (var i = 0; i <= size[0]; i++){
    for (var j = 0; j <= size[1]; j++){
      grid[i+pos[0]][j+pos[1]] = false;
      removeEmpty(i+pos[0], j+pos[1]);
    }
  }

  rects.push(new Rect(...pos, size[0]+1, size[1]+1))
}

function removeEmpty(x, y){
  emptys = emptys.filter(i => !(i[0] === x && i[1] === y));
}

function isEmpty(x, y){
  return inBounds(x, y) && grid[x][y];
}

function inBounds(x, y){
  return x >= 0 && y >= 0 && x < gw && y < gh;
}

function rInt(a = 0, b){
  if (!b){
    b = a;
    a = 0;
  }
  return floor(a + random(b - a));
}

function drawCanvas(){
  clear();
  let w = bimg.width;
  let h = bimg.height;
  
  for (var x = 0; x < width; x += w)
  for (var y = 0; y < height; y += h) image(bimg, x, y);
}

function draw(){
  drawCanvas();
  
  for (var x = xOff; x < width; x += cellSize) line(x, yOff, x, height-yOff);
  for (var y = yOff; y < height; y += cellSize) line(xOff, y, width - xOff, y);
  
  if (grid){
    for (var i = 0; i < 10; i++){
      buildGrid();
    }
  }
  rects.map(i => i.render());
  
  fill(240, 100, 100);
  
  for (var x = 0; x < gw; x++){
    for (var y = 0; y < gh; y++){
      if (grid[x][y]){
        ellipse((x+.5)*cellSize + xOff, (y+.5)*cellSize + yOff, cellSize/2);
      }
    }
  }
}

function mousePressed(){
  init();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  init();
}