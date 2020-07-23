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

interface asteroidI {
  x: number;
  y: number;
  width: number;
  speed: number;
  angle: number;
  angleChange: number;
  hitpoints: number;
}
let showOnce = true;

let clock = 0;

const App = new p5((s: p5) => {
  let singleAsteroid: asteroidI;
  let bullets: bulletI[] = [];
  let bullet: bulletI;
  let ship: shipI;
  s.setup = () => {
    s.createCanvas(700, 700);
    s.background(100);
    // s.frameRate(5);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: -180,
      speed: 3,
      angleChange: 3,
    };
    singleAsteroid = {
      x: s.width / 4,
      y: s.height / 4,
      angle: 33,
      speed: 1,
      angleChange: 3,
      width: 100,
      hitpoints: 10,
    };
  };

  const shipLogic = () => {
    s.push();
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
    s.pop();
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
      ship.angleChange += 0.1;
    }
  };
  const decreaseAngleSpeed = () => {
    if (s.keyIsDown(81)) {
      console.log("q");
      ship.angleChange -= 0.1;
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
    if (s.keyIsDown(s.LEFT_ARROW)) {
      ship.angle -= ship.angleChange * 2;
    }
  };
  const handleRight = () => {
    if (s.keyIsDown(s.RIGHT_ARROW)) {
      ship.angle += ship.angleChange * 2;
    }
  };
  const handleUp = () => {
    if (s.keyIsDown(s.UP_ARROW)) {
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians) * ship.speed;
      ship.y += Math.sin(radians) * ship.speed;
    }
  };

  const shoot = () => {
    if (s.keyIsDown(32)) {
      let bulletRadians = (Math.PI * ship.angle) / 180;
      let bllt = {
        x: ship.x,
        y: ship.y,
        speed: 8,
        radians: bulletRadians,
      };
      bullets.push(bllt);
    }
  };

  const handleDown = () => {
    if (s.keyIsPressed && s.keyCode === s.DOWN_ARROW) {
      ship.x -= Math.cos(ship.angle) * 5;
      ship.y -= Math.sin(ship.angle) * 5;
    }
  };

  const handleDirections = () => {
    // handleLeftAndForward();
    // handleRightAndForward();
    handleLeft();
    handleRight();
    handleUp();
    // handleDown();
  };

  const handleasteroid = () => {
    if (singleAsteroid) {
      singleAsteroid.angle += singleAsteroid.angleChange;
      // singleAsteroid.x += singleAsteroid.speed;
      // singleAsteroid.y += singleAsteroid.speed;
      // console.log("ast x", singleAsteroid.x, "ast y", singleAsteroid.y);
      s.push();
      s.translate(singleAsteroid.x, singleAsteroid.y);
      let rdns = s.radians(singleAsteroid.angle);
      s.rotate(rdns);

      s.fill(102, 0, 204);
      s.stroke(150);
      s.strokeWeight(10);
      s.rectMode("center");
      s.rect(0, 0, singleAsteroid.width, singleAsteroid.width);
      s.stroke(10);
      s.strokeWeight(2);
      s.fill(1, 200, 50);

      let first = s.rect(
        0,
        0,
        singleAsteroid.width / 10,
        singleAsteroid.width / 10
      );

      s.pop();
    }
  };
  //todo, log radians and understand whats going on
  setInterval(() => {
    console.clear();
  }, 1000);
  s.draw = () => {
    clock++;
    // logger();
    handleDirections();
    increaseSpeed();
    decreaseSpeed();
    increaseAngleSpeed();
    decreaseAngleSpeed();
    s.background(100);
    if (clock % 2 === 0) {
      shoot();
    }
    for (let i = 0; i < bullets.length; i++) {
      let bllt = bullets[i];
      if (bllt) {
        if (singleAsteroid) {
          if (
            bllt.x < singleAsteroid.x + singleAsteroid.width / 2 &&
            bllt.x > singleAsteroid.x - singleAsteroid.width / 2 &&
            bllt.y < singleAsteroid.y + singleAsteroid.width / 2 &&
            bllt.y > singleAsteroid.y - singleAsteroid.width / 2
          ) {
            singleAsteroid.width--;
          }
        }
        if (singleAsteroid.width < 20) {
          singleAsteroid.width = 0;
        }

        //is it on map
        if (bllt.x > 0 && bllt.x < s.width && bllt.y > 0 && bllt.y < s.height) {
          s.fill(204, 101, 192, 127);
          s.stroke(127, 63, 120);
          s.ellipse(bllt.x, bllt.y, 10, 10);
          bllt.x += Math.cos(bllt.radians) * bllt.speed;
          bllt.y += Math.sin(bllt.radians) * bllt.speed;
        } else {
          bullets.splice(i, 1);
        }
      }
    }
    shipLogic();
    handleasteroid();
  };
});

export default App;
