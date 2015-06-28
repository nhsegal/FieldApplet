var chargeValSlider;

//arrays
var sources = [];
var tests = [];
var arrows = [];

var fieldArrow, a, mouseArrow; //Arrows
var mouseTest; //testCharge

var mouse; //PVector
var r; //PVector

var sliderValue = 1;
var stopped = false;
var chargeArr = 0; //charge arrangment
visVal = document.getElementById("menuVis");
var visValNum =0;

function setup() {
  var cnv = createCanvas(1000, 400);
  cnv.parent("myContainer");

  chargeValSlider = createSlider( -40, 40, 10);
  chargeValSlider.parent("sliderPos");
  chargeValSlider.size(240);  
  chargeValSlider.mousePressed(numCheck);

  smooth();
  chargeArrangement(1);
  mouse = createVector(mouseX, mouseY);
  mouseTest = new testCharge(0, 0);
  mouseArrow = new Arrow(mouse, 10, 10);
  visualization(0);
  getChargeArrangement();

}

function draw() {
  background(255);
  visVal = document.getElementById("menuVis");
  visValNum = visVal.options[visVal.selectedIndex].value;
  chargeValSlider.mouseReleased(numCheck);
  rect(0,0,width-1,height-1);
  getChargeArrangement();
  for (var k = 0; k < sources.length; k++) {
    sources[k].display();
  }
  
  mouse.set(mouseX, mouseY);
  mouseTest.pos.set(mouseX, mouseY);
  mouseArrow.location = mouse;
  mouseTest.updateEtot();
  mouseArrow.angle =  mouseTest.Etot.heading();
  mouseArrow.len = mouseTest.Etot.mag();
  mouseArrow.display();


  for (var j = tests.length-1; j >=0; j--) {
    tests[j].updateEtot(); 
    if (visValNum == 2){
      line(tests[j].pos.x, tests[j].pos.y, tests[j].pos.x + 10*tests[j].Etot.x, tests[j].pos.y + 10*tests[j].Etot.y);
    }

    else{
      var mag = tests[j].Etot.mag();
      var a = new Arrow(tests[j].pos, tests[j].Etot.heading(), mag );
      if (a.len < 90) {
        a.display();
      }
    }
  }
}


function Arrow(location_, angle_, len_){
  this.location = location_;
  this.angle = angle_;
  this.len = len_;
}

Arrow.prototype.display = function(){
  strokeWeight(.5);
  stroke(0);
  push();
    translate(this.location.x, this.location.y);
    rotate(this.angle);
    line(0, 0, this.len, 0);
    
    push();
      translate(this.len, 0);
      rotate(atan(PI/6));
      line(0,0, -this.len/10, 0);
    pop();
    
    push();
      translate(this.len, 0);
      rotate(atan(-PI/6));
      line(0,0, -this.len/10, 0);
    pop();
  pop(); 
  
}


function chargeArrangement(a) {
  if (a == 0) {
    sources = [];
    sources.push(new sourceCharge(width/2, height/2, sliderValue));
  }
  //dipole
  if (a == 1) {
    sources = [];
    sources.push(new sourceCharge(width/3, height/2,  sliderValue));
    sources.push(new sourceCharge(2*width/3, height/2, 1));
  }
  if (a == 2) {
    sources = [];
    sources.push(new sourceCharge(width/2 - 100, height/2 -100,  -sliderValue/2));
    sources.push(new sourceCharge(width/2 + 100, height/2 - 100,  sliderValue/2));
    sources.push(new sourceCharge(width/2 - 100, height/2 + 100,  sliderValue/2));
    sources.push(new sourceCharge(width/2 + 100, height/2 +100, -sliderValue/2));
  }
  if (a == 3) {
    sources = [];
    for (var i = -12; i < 12; i++) {
      sources.push(new sourceCharge(width/2 +10*i, 3*height/9,  .02*sliderValue));
      sources.push(new sourceCharge(width/2 + 10*i, 5*height/9 ,  -.02*sliderValue));
    }
  }
}


function sourceCharge(posX, posY, q_) {
  this.pos = createVector(posX, posY);
  this.q = q_; 
}

sourceCharge.prototype.display = function() {
  fill(125 + this.q*720, 0, 125 - 720*this.q);
  noStroke();
  ellipse(this.pos.x, this.pos.y, 15, 15);
}

sourceCharge.prototype.eField = function(r) {
  this.E = p5.Vector.mult(r, pow(r.mag(), -2));  // E = kq/r
  this.E.mult(this.q);
  this.E.mult(1500);
  return this.E;
}

function testCharge(posX, posY) {
  this.pos = createVector(posX, posY);
  this.Etot = createVector(0,0);
}

testCharge.prototype = {
  constructor: testCharge,
  updateEtot : function () {
    this.Etot.set(0,0);
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i];
      r = createVector(this.pos.x - s.pos.x, this.pos.y - s.pos.y);
      this.Etot.add(s.eField(r));    
      
    }
    if ((visValNum == 2) && (this.pos != mouseTest.pos)) {
      this.Etot.normalize();
    }
    return this.Etot; 
  }
}


function visualization(a) {
  //mouse
  if (a == 0) {
    tests.push(new testCharge(mouseX, mouseY));
  }
  //array
  if (a == 1) {
    tests = [];
    tests.push(new testCharge(mouseX, mouseY));
    for (var i = 0; i < width; i=i+20) {
      for (var j = 0; j < height; j=j+20) {
        tests.push(new testCharge(i, j));   
      }
    }
  }
  //lines
  if (a == 2) {
    tests = [];
    tests.push(new testCharge(mouseX, mouseY));
  }
}


function numCheck(){
  sliderValue = chargeValSlider.value()/10;
  visVal = document.getElementById("menuVis");
  if (visVal.options[visVal.selectedIndex].value == 2){
      tests = [];
    };
}
function getChargeArrangement() {
  chargeArr = document.getElementById("menuChargeArr");
  chargeArrangement(chargeArr.options[chargeArr.selectedIndex].value);
}
function getVis() {
  visVal = document.getElementById("menuVis");
  visualization(visVal.options[visVal.selectedIndex].value);
}
function resetFunction() {
  visVal = document.getElementById("menuVis");
  if (visVal.options[visVal.selectedIndex].value == 0 || visVal.options[visVal.selectedIndex].value == 2){
    tests = [];
  }   
}



function mouseClicked() {
  visVal = document.getElementById("menuVis");
  if (visVal.options[visVal.selectedIndex].value == 0){
    tests.push(new testCharge(mouseX, mouseY));
  }  
  if ((visVal.options[visVal.selectedIndex].value == 2) && (mouseX < width) && (mouseX > 0) && (mouseY < height) && (mouseY > 0) ){  
    tests.push(new testCharge(mouseX, mouseY));
    fieldline(mouseX, mouseY);
  } 
  return false;
} 



function fieldline(x, y) {
  var a = x;
  var b = y;
  var t = new testCharge(x, y);
  var m = new testCharge(a, b);
  var breakerFront = false;
  var breakerBack = false; 

//extend the list of tests in either direction
  for (var i = 0; i <360; i++) {
    if (breakerFront == false) {
      tests.push(new testCharge(x, y));
      tests[tests.length-1].updateEtot();
      t = tests[tests.length-1];
    }
    if (breakerBack == false) { 
      tests.unshift(new testCharge(a, b));
      tests[0].updateEtot();
      m = tests[0];
    }

    if (breakerFront == false) {
      t.updateEtot();
      x = x + 10*t.Etot.x/t.Etot.mag();
      y = y + 10*t.Etot.y/t.Etot.mag();
    }
    if (breakerBack == false) {
      m.updateEtot();
      a = a - 10*m.Etot.x/m.Etot.mag();
      b = b - 10*m.Etot.y/m.Etot.mag();
    }

    for (var e = sources.length-1; e >= 0; e--) {
      var s = sources[e];
      if (p5.Vector.dist(t.pos, s.pos) < 30) {
        breakerFront = true;
      }
      if (p5.Vector.dist(m.pos, s.pos) < 20) {
        breakerBack = true;
      } 
    }
  }
}
