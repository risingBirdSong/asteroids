import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
  speed: number;
  angleChange: number;
  hitpoints: number;
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
  trajectory: number;
  hitpoints: number;
}
let showOnce = true;

let clock = 0;

//great algorithm on how to bias random numbers :)
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
function getRndBias(min: number, max: number, bias: number, influence: number) {
  var rnd = Math.random() * (max - min) + min, // random in range
    mix = Math.random() * influence; // random mixer
  return rnd * (1 - mix) + bias * mix; // mix full range and bias
}

const App = new p5((s: p5) => {
  let singleAsteroid: asteroidI;
  let asteroids: asteroidI[] = [];
  let howManyAsteroidsAtStart: number = 20;
  const bullets: bulletI[] = [];
  let bullet: bulletI;
  let ship: shipI;
  s.setup = () => {
    s.createCanvas(700, 700);
    s.background(100);
    // s.frameRate(5);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: -90,
      speed: 4,
      angleChange: 3,
      hitpoints: 100,
    };
    singleAsteroid = {
      x: s.width / 4,
      y: s.height / 4,
      angle: 33,
      speed: 2,
      angleChange: 3,
      width: 100,
      hitpoints: 10,
      trajectory: getRndBias(10, 80, 45, 0.8),
    };
    makeAsteroids(howManyAsteroidsAtStart);
  };

  const makeAsteroids = (howmany: number) => {
    for (let i = 0; i < howmany; i++) {
      let asteroid: asteroidI = {
        angle: s.random(0, 360),
        angleChange: s.random(-5, 5),
        hitpoints: 100,
        speed: s.random(3, 5),
        width: s.random(50, 100),
        trajectory: getRndBias(10, 80, 45, 0.2),
        x: 0,
        y: 0,
      };
      let rnd = s.random(0, 100);
      if (rnd <= 50) {
        // (asteroid.x = s.random(0, s.width)),
        asteroid.x = getRndBias(-200, s.width, -100, 1);
        asteroid.y = s.random(-100, -300);
      } else if (rnd > 50) {
        asteroid.x = s.random(-100, -300);
        asteroid.y = getRndBias(-200, s.height, -100, 1);
      }
      // x: s.random(0, s.width),
      // y: s.random(-100, -300),
      //cuz why not concat sometimes?
      asteroids = asteroids.concat(asteroid);
    }
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
      // console.log("ast x", singleAsteroid.x, "ast y", singleAsteroid.y);
      // s.push();
      s.translate(singleAsteroid.x, singleAsteroid.y);
      let rdnsSpin = s.radians(singleAsteroid.angle);
      let rdnsTrajectory = s.radians(singleAsteroid.trajectory);
      singleAsteroid.x += Math.cos(rdnsTrajectory) * singleAsteroid.speed;
      singleAsteroid.y += Math.sin(rdnsTrajectory) * singleAsteroid.speed;
      s.rotate(rdnsSpin);
      s.fill(102, 0, 204);
      s.stroke(150);
      s.strokeWeight(10);
      s.rectMode("center");
      s.rect(0, 0, singleAsteroid.width, singleAsteroid.width);
      s.stroke(10);
      s.strokeWeight(2);
      s.fill(1, 200, 50);
      // s.pop();
    }
  };
  const handleasteroids = (astrd: asteroidI, idx: number) => {
    if (astrd) {
      if (astrd.x > s.width * 1.3 || astrd.y > s.height * 1.3) {
        asteroids.splice(idx, 1);
      }
      // console.log("ast x", astrd.x, "ast y", astrd.y);
      s.push();
      s.translate(astrd.x, astrd.y);
      let rdnsSpin = s.radians(astrd.angle);
      let rdnsTrajectory = s.radians(astrd.trajectory);
      astrd.x += Math.cos(rdnsTrajectory) * astrd.speed;
      astrd.y += Math.sin(rdnsTrajectory) * astrd.speed;
      astrd.angle += astrd.angleChange;
      s.rotate(rdnsSpin);
      s.fill(102, 0, 204);
      s.stroke(150);
      s.strokeWeight(10);
      s.rectMode("center");
      s.rect(0, 0, astrd.width, astrd.width);
      s.stroke(10);
      s.strokeWeight(2);
      s.fill(1, 200, 50);
      s.pop();
      // s.translate(astrd.x, astrd.y);
    }
  };
  //todo, log radians and understand whats going on

  setInterval(() => {
    console.clear();
  }, 1000);
  s.draw = () => {
    console.log(asteroids[0].x, asteroids[0].y);
    clock++;
    // logger();
    // setTimeout(() => {}, 200);
    handleDirections();
    increaseSpeed();
    decreaseSpeed();
    increaseAngleSpeed();
    decreaseAngleSpeed();
    s.background(100);
    if (clock % 2 === 0) {
      shoot();
    }
    if (clock % 5 === 0) {
      makeAsteroids(1);
    }
    if (ship.hitpoints < 0) {
      console.log("dead");
    }
    for (let i = 0; i < asteroids.length; i++) {
      let astrd = asteroids[i];
      handleasteroids(astrd, i);
    }
    for (let astr of asteroids) {
      if (
        ship.x < astr.x + astr.width / 2 &&
        ship.x > astr.x - astr.width / 2 &&
        ship.y < astr.y + astr.width / 2 &&
        ship.y > astr.y - astr.width / 2
      ) {
        ship.hitpoints--;
        console.log(" ship hit");
      }
    }
    for (let i = 0; i < bullets.length; i++) {
      let bllt = bullets[i];
      if (bllt) {
        for (let astr of asteroids) {
          if (
            bllt.x < astr.x + astr.width / 2 &&
            bllt.x > astr.x - astr.width / 2 &&
            bllt.y < astr.y + astr.width / 2 &&
            bllt.y > astr.y - astr.width / 2
          ) {
            astr.width -= 5;
          }
        }
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
