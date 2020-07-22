import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
  speed: number;
  angleChange: number;
}

interface bulletI {
  x: number;
  y: number;
  speed: number;
  radians: number;
}
let showOnce = true;

const App = new p5((s: p5) => {
  let bullets: bulletI[] = [];
  let bullet: bulletI;
  let ship: shipI;
  s.setup = () => {
    s.createCanvas(1000, 1000);
    s.background(100);
    // s.frameRate(20);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: 0,
      speed: 3,
      angleChange: 5,
    };
  };

  const shipLogic = () => {
    s.translate(ship.x, ship.y);
    s.rotate(s.radians(ship.angle));
    s.stroke(50);
    // s.rect(0, 0, 100, 30);
    // s.fill(200);
    // s.rect(0, 0, 10, 30);
    s.strokeWeight(10);
    s.strokeCap("round");
    s.line(0, 0, 40, 0);
    s.stroke(200, 1, 100);
    s.ellipse(0, 0, 4, 4);
  };

  const logger = () => {
    if (showOnce === true) {
      showOnce = false;
      console.clear();
      let radians = (Math.PI * ship.angle) / 180;
      // console.log("ship angle", ship.angle);
      // console.log("up radians", radians);
      // console.log("cos rads", Math.cos(radians) * 10);
      // console.log("sin rads", Math.sin(radians) * 10);
      setTimeout(() => {
        showOnce = true;
      }, 1000);
    }
  };
  const handleLeftAndForward = () => {
    if (s.keyIsDown(s.UP_ARROW) && s.keyIsDown(s.LEFT_ARROW)) {
      ship.angle -= ship.angleChange;
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians);
      ship.y += Math.sin(radians);
    }
  };

  const increaseSpeed = () => {
    if (s.keyIsDown(87)) {
      ship.speed += 0.1;
    }
  };
  const increaseAngleSpeed = () => {
    if (s.keyIsDown(69)) {
      ship.angleChange += 0.3;
    }
  };
  const decreaseAngleSpeed = () => {
    if (s.keyIsDown(81)) {
      console.log("q");
      ship.angleChange -= 0.3;
    }
    if (ship.angleChange < 0) {
      ship.angleChange = 0.2;
    }
  };

  const decreaseSpeed = () => {
    if (s.keyIsDown(83)) {
      ship.speed -= 0.1;
    }
    if (ship.speed < 0) {
      ship.speed = 0;
    }
  };

  const handleRightAndForward = () => {
    if (s.keyIsDown(s.UP_ARROW) && s.keyIsDown(s.RIGHT_ARROW)) {
      ship.angle += ship.angleChange;
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians);
      ship.y += Math.sin(radians);
    }
  };

  const handleLeft = () => {
    if (s.keyIsPressed && s.keyCode === s.LEFT_ARROW) {
      ship.angle -= ship.angleChange * 2;
    }
  };
  const handleRight = () => {
    if (s.keyIsPressed && s.keyCode === s.RIGHT_ARROW) {
      ship.angle += ship.angleChange * 2;
    }
  };
  const handleUp = () => {
    if (s.keyIsPressed && s.keyCode === s.UP_ARROW) {
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians) * ship.speed;
      ship.y += Math.sin(radians) * ship.speed;
      console.log("up radians", radians);
      console.log("cos rads", Math.cos(radians));
      console.log("sin rads", Math.sin(radians));
    }
  };

  const shoot = () => {
    if (s.keyIsPressed && s.keyCode === 32) {
      console.log("shooting");
      let bulletRadians = (Math.PI * ship.angle) / 180;
      bullet = {
        x: ship.x,
        y: ship.y,
        speed: 3,
        radians: bulletRadians,
      };
    }
  };

  const handleDown = () => {
    if (s.keyIsPressed && s.keyCode === s.DOWN_ARROW) {
      ship.x -= Math.cos(ship.angle) * 5;
      ship.y -= Math.sin(ship.angle) * 5;
    }
  };

  const handleDirections = () => {
    handleLeftAndForward();
    handleRightAndForward();
    handleLeft();
    handleRight();
    handleUp();
    handleDown();
  };
  //todo, log radians and understand whats going on
  s.draw = () => {
    // logger();
    handleDirections();
    increaseSpeed();
    decreaseSpeed();
    increaseAngleSpeed();
    decreaseAngleSpeed();
    shoot();
    // s.background(100);
    if (bullet) {
      if (
        bullet.x > 0 &&
        bullet.x < s.width &&
        bullet.y > 0 &&
        bullet.y < s.height
      ) {
        console.log("bullet exists", "x", bullet.x, "y", bullet.y);
        s.fill(204, 101, 192, 127);
        s.stroke(127, 63, 120);
        s.ellipse(bullet.x, bullet.y, 30, 30);
        bullet.x += Math.cos(bullet.radians) * bullet.speed;
        bullet.y += Math.sin(bullet.radians) * bullet.speed;
      }
    }
    shipLogic();
  };
});

export default App;
