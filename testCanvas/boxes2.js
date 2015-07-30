// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.

//c is the canvas created for debugging purposes only
var c;

function Shape(currX, currY, points, color) {
    this.points = points;
    this.currX = currX;
    this.currY = currY;
    this.color = color;
}

Shape.prototype.draw = function(context){
  context.beginPath();
  context.moveTo(this.currX + this.points[0].x, this.currY + this.points[0].y);
  for(var i=0; i<this.points.length; i++){
      context.lineTo(this.currX + this.points[i].x , this.currY + this.points[i].y);
  }
  context.fillStyle = this.color;
  context.fill();
  context.lineJoin = 'round';
  context.stroke();
  context.closePath();
};

// Determine if a point is inside the shape's bounds by pathing each shape and calling isPointInPath
// Start from back to get the newest placed if theres overlap
Shape.prototype.contains = function(mouseX, mouseY,ctx) {
   ctx.beginPath();
   ctx.moveTo(this.points[0].x+this.currX,this.points[0].y+this.currY);
   for(var i=1;i<this.points.length;i++){
     ctx.lineTo(this.points[i].x+this.currX,this.points[i].y+this.currY);
   }
    if(ctx.isPointInPath(mouseX,mouseY)){
            console.log("true meow");
      return true;
    }
        
return false;
}

function CanvasState(canvas) {
  //setup for when canvas is made
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
 
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  
  // **** events ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    for (var i = shapes.length-1 ; i >= 0 ; i--) {
      if (shapes[i].contains(mx, my, myState.ctx)) {
        var mySel = shapes[i];
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.currX;
        myState.dragoffy = my - mySel.currY;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
  if (myState.dragging){
    var mouse = myState.getMouse(e);
    // We don't want to drag the object by its top-left corner, we want to drag it
    // from where we clicked. Thats why we saved the offset and use it here
    myState.selection.currX = mouse.x - myState.dragoffx;
    myState.selection.currY = mouse.y - myState.dragoffy;   
    myState.valid = false; // redraw
  }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);
 
 //Fun function to return random color
  function get_random_color() {
  function c() {
    return Math.floor(Math.random()*256).toString(16)
  }
  return "#"+c()+c()+c();
}
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, shapePoints.AND,get_random_color()));
  }, true);
  

  // **** Options! ****
  this.interval = 30;
 setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
    // draw all shapes
    for (var i = 0; i < shapes.length; i++) {
       shapes[i].draw(ctx);
    }
  this.valid = true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  return {x: mx, y: my};
}

var shapePoints={
    AND :[{x:100, y:100}, {x:200, y:200}, {x:100, y:300}, {x:0, y:200}, {x:100, y:100}],
    OR : [{x:100, y:100}, {x:300, y:200}, {x:100, y:50}, {x:100,y:100}]
};

//initilisation method called from html on load up
function init() {
  var cs = new CanvasState(document.getElementById('game-area'));
  cs.addShape(new Shape(15,15,shapePoints.AND,"#F00"));
  cs.addShape(new Shape(15,15,shapePoints.OR,"#00F"));
  
  // debuggin pruposes only
  c = cs;
 
}