import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
  speed: number;
  angleChange: number;
  hitpoints: number;
  thrust: number;
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

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

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
  let howManyAsteroidsAtStart: number = 10;
  const bullets: bulletI[] = [];
  let bullet: bulletI;
  let ship: shipI;
  let death: p5.Element;
  s.setup = () => {
    s.createCanvas(700, 700);
    s.background(100);
    death = s.createP("ship broke from asteroid hits");
    death.addClass("death");
    death.hide();
    // s.frameRate(5);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: -90,
      speed: 4,
      angleChange: 3,
      hitpoints: 3,
      thrust: 0,
    };
    singleAsteroid = {
      x: s.width / 4,
      y: s.height / 4,
      angle: 33,
      speed: 2,
      angleChange: 3,
      width: 100,
      hitpoints: 3,
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
        speed: s.random(2, 6),
        width: getRndBias(50, 500, 100, 0.5),
        trajectory: getRndBias(10, 80, 45, 0.9),
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

  const handleThrust = () => {
    let radians = (Math.PI * ship.angle) / 180;
    ship.x += Math.cos(radians) * ship.speed * ship.thrust;
    ship.y += Math.sin(radians) * ship.speed * ship.thrust;
  };

  const handleUp = () => {
    if (s.keyIsDown(s.UP_ARROW)) {
      if (ship.thrust < 1.6) {
        ship.thrust += 0.05;
      }
    }
  };

  const handleDown = () => {
    if (s.keyIsDown(s.DOWN_ARROW)) {
      if (ship.thrust > -1) {
        ship.thrust -= 0.05;
      }
    }
  };

  const shoot = (shotgun?: boolean) => {
    if (s.keyIsDown(32)) {
      let bulletRadians = (Math.PI * ship.angle) / 180;
      if (shotgun) {
        bulletRadians += s.random(-1, 1);
      }
      let bllt = {
        x: ship.x,
        y: ship.y,
        speed: s.random(7, 12),
        radians: bulletRadians,
      };
      bullets.push(bllt);
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

  const handleAsteroid = () => {
    if (singleAsteroid) {
      singleAsteroid.angle += singleAsteroid.angleChange;
      // console.log("ast x", singleAsteroid.x, "ast y", singleAsteroid.y);
      s.push();
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
      s.pop();
    }
  };
  const handleAsteroids = (astrd: asteroidI, idx: number) => {
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
    // console.log(asteroids[0].x, asteroids[0].y);
    clock++;
    // logger();
    // setTimeout(() => {}, 200);
    handleThrust();
    handleDown();
    handleDirections();
    increaseSpeed();
    decreaseSpeed();
    increaseAngleSpeed();
    decreaseAngleSpeed();
    s.background(100);
    //fire rate

    if (clock % 2 === 0) {
      shoot();
    }
    if (clock % 30 === 0) {
      shoot(true);
    }

    if (clock % 50 === 0) {
      for (let i of range(1, 5)) {
        shoot();
      }
    }
    if (clock % 100 === 0) {
      for (let i of range(1, 10)) {
        shoot(true);
      }
    }
    //growth more asteroids
    if (clock % 9 === 0) {
      makeAsteroids(1);
    }
    //die broke
    if (ship.hitpoints < 0) {
      death.show();
      ship.x = s.width * 10;
      ship.y = s.height * 10;
    }
    for (let i = 0; i < asteroids.length; i++) {
      let astrd = asteroids[i];
      handleAsteroids(astrd, i);
    }
    for (let astr of asteroids) {
      if (
        ship.x < astr.x + astr.width / 2 &&
        ship.x > astr.x - astr.width / 2 &&
        ship.y < astr.y + astr.width / 2 &&
        ship.y > astr.y - astr.width / 2
      ) {
        ship.hitpoints -= 1;
        console.log(" ship hit");
      }
    }
    for (let i = 0; i < bullets.length; i++) {
      let bllt = bullets[i];
      if (bllt) {
        for (let j = 0; j < asteroids.length; j++) {
          let astr = asteroids[j];
          //erase die kill
          if (astr.width < 20) {
            asteroids.splice(j, 1);
          }
          //hit contact damage
          if (
            bllt.x < astr.x + astr.width / 2 &&
            bllt.x > astr.x - astr.width / 2 &&
            bllt.y < astr.y + astr.width / 2 &&
            bllt.y > astr.y - astr.width / 2
          ) {
            astr.width -= getRndBias(1, 50, 3, 0.9);
            bullets.splice(i, 1);
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
        if (
          bllt.x > -400 &&
          bllt.x < s.width + 400 &&
          bllt.y > -400 &&
          bllt.y < s.height + 400
        ) {
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
    // handleAsteroid();
    shipLogic();
  };
});

export default App;
