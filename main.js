// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const counter = document.querySelector('p');
const winner = document.querySelector('h2');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


let balls = [];

// function to generate random number

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape(x, y, velX, velY, exist = true) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exist = exist;
    
  }

function Ball( x, y, velX, velY, exist, color, size) {
    Shape.call(this, x, y, velX, velY, exist);
    this.color = color;
    this.size = size;
}

function EvilCircle(x, y, velX, velY, exist, color, size) {
    Shape.call(this, x, y, velX, velY, exist);
    this.color = color;
    this.size = size;
}

  EvilCircle.prototype.draw = function() {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'white';
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
  }

  EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
      this.x = -(this.x);
    }
  
    if ((this.x - this.size) <= 0) {
      this.x = -(this.x);
    }
  
    if ((this.y + this.size) >= height) {
      this.y = -(this.y);
    }
  
    if ((this.y - this.size) <= 0) {
      this.y = -(this.y);
    }
  
  }

  EvilCircle.prototype.setControls = function() {
    var _this = this;
    window.onkeydown = function(e) {
        // console.log(e.keyCode);
        if (e.keyCode === 65) {
          _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
          _this.x += _this.velX;
        } else if (e.keyCode === 87) {
          _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
          _this.y += _this.velY;
        }
      }
  }

  EvilCircle.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
      if (balls[j]) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls.splice(j, 1);
          balls.length === 0 ? winner.innerText = 'Well done Alexey! You see it is not so hard, just try :)' : counter.innerText = balls.length;
        }
      }

    }
  }

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    for (var i=0; i < 2*8+1; i++) {
      var r = (i%2 == 0)? 30 : 20;
      var a = Math.PI * i/8;
      ctx.lineTo(this.x + r*Math.sin(a), this.y + r*Math.cos(a));
  };
    ctx.fill();
  }

  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
  
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
  
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
  
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
  
    this.x += this.velX;
    this.y += this.velY;
  }

  Ball.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        var dx = this.x - balls[j].x;
        var dy = this.y - balls[j].y;
        var distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
  }

  let evilCircle = new EvilCircle(
      random(0,width),
      random(0,height),
      20,
      20,
      true,
      'white',
      10
  );
  evilCircle.setControls();

  while (balls.length < 25) {
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
      true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    balls.push(ball);
  }


  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    evilCircle.draw();
  
    for (var i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();

      evilCircle.checkBounds();
      evilCircle.collisionDetect()
      
    }
  
    requestAnimationFrame(loop);
  }

  loop();

