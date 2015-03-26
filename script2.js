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

function setup() {
  var cnv = createCanvas(1000, 400);
  cnv.parent("myContainer");


  chargeValSlider = createSlider( 3, 17, 9);
  chargeValSlider.parent("sliderPos");
  chargeValSlider.size(240);  




  smooth();
  chargeArrangement(1);
  mouse = createVector(mouseX, mouseY);
  mouseTest = new testCharge(0, 0);
  mouseArrow = new Arrow(mouse, 10, 10);
  visualization(1);
}

function draw() {
  background(200);
  //myFunction();
  for (var k = 0; k < sources.length; k++) {
    sources[k].display();
  }

  for (var j = 0; j < tests.length; j++) {
    stroke(0);
    var a = new Arrow(tests[j].pos, tests[j].Etot(sources).heading(), tests[j].Etot(sources).mag() );
    if (a.len < 120) {
      a.display();
    }
  }

  mouse.set(mouseX, mouseY);
  mouseTest.pos.set(mouseX, mouseY);
  mouseArrow.location = mouse;
  mouseArrow.angle = mouseTest.Etot(sources).heading();
  mouseArrow.len = mouseTest.Etot(sources).mag();
  smooth();
  mouseArrow.display();


}


function Arrow(location_, angle_, len_){
  this.location = location_;
  this.angle = angle_;
  this.len = len_;
  
  
    this.display = function() {
    strokeWeight(.5);
    stroke(0);
    smooth();
    
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

    this.display = function() {
      fill(125 + this.q*720, 0, 125 - 720*this.q);
      noStroke();
      ellipse(this.pos.x, this.pos.y, 15, 15);
    }

    this.eField = function(r) {
      this.E = p5.Vector.mult(r, pow(r.mag(), -2));  // E = kq/r
      this.E.mult(this.q);
      this.E.mult(1500);
      return this.E;
    }
}


function testCharge(posX, posY) {
  this.pos = createVector(posX, posY);
  //Given the field from each source, return the sum
  this.Etot = function() {
    this.temp = createVector(0, 0);
    for (var i = 0; i < sources.length; i++) {
      var s = sources[i];
      r = createVector(this.pos.x - s.pos.x, this.pos.y - s.pos.y);
      this.temp.add(s.eField(r));
    }
    return this.temp;
  }
}

function visualization(a) {

  //mouse
  if (a == 0) {
    tests = [];
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


function myFunction() {
  var e = document.getElementById("menu1");
  chargeArrangement(e.options[e.selectedIndex].value);
}