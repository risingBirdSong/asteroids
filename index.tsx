import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
  speed: number;
  angleChange: number;
}

console.log("force");
const App = new p5((s: p5) => {
  let ship: shipI;
  let showOnce = true;
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

  // s.keyPressed = () => {
  //   switch (s.keyCode) {
  //     case s.LEFT_ARROW:
  //       ship.angle--;
  //       break;
  //     case s.UP_ARROW:
  //       ship.angle++;
  //       break;
  //     default:
  //       break;
  //   }
  //   console.log(s.keyCode);
  // };

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
    if (showOnce) {
      showOnce = false;
      console.log("key", s.keyCode);
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
      console.log("angle ++");
      ship.angleChange += 0.3;
    }
  };
  const decreaseAngleSpeed = () => {
    if (s.keyIsDown(81)) {
      ship.angleChange -= 0.3;
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
    logger();
    handleDirections();
    increaseSpeed();
    decreaseSpeed();
    increaseAngleSpeed();
    decreaseAngleSpeed();
    s.background(100);
    shipLogic();
  };
});

export default App;
