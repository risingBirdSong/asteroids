import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

console.log("force");
const App = new p5((s: p5) => {
  let ship: shipI;
  let showOnce = true;
  s.setup = () => {
    s.createCanvas(800, 800);
    s.background(100);
    // s.frameRate(20);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: 0,
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
    s.fill(150);
    s.strokeWeight(2);
    s.stroke(50);
    s.rect(0, 0, 100, 30);
    s.fill(200);
    s.rect(0, 0, 10, 30);
  };

  const logger = () => {
    if (showOnce) {
      showOnce = false;
      console.clear();
      console.log("keycode", s.keyCode);
      console.log("ship angle", ship.angle);
      console.log("sin", Math.sin(ship.angle) * 10);
      console.log("cos", Math.cos(ship.angle) * 10);
      // ship.x += Math.sin(ship.angle) *2
      setTimeout(() => {
        showOnce = true;
      }, 1000);
    }
  };
  //todo, log radians and understand whats going on
  s.draw = () => {
    logger();
    if (s.keyIsDown(s.LEFT_ARROW) && s.keyIsDown(s.UP_ARROW)) {
      ship.angle -= 3;
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians);
      ship.y += Math.sin(radians);
    }
    if (s.keyIsDown(s.RIGHT_ARROW) && s.keyIsDown(s.UP_ARROW)) {
      ship.angle += 3;
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians);
      ship.y += Math.sin(radians);
    }
    if (s.keyIsPressed && s.keyCode === s.LEFT_ARROW) {
      ship.angle -= 3;
    }
    if (s.keyIsPressed && s.keyCode === s.RIGHT_ARROW) {
      ship.angle += 3;
    }
    if (s.keyIsPressed && s.keyCode === s.UP_ARROW) {
      let radians = (Math.PI * ship.angle) / 180;
      ship.x += Math.cos(radians);
      ship.y += Math.sin(radians);
    }
    if (s.keyIsPressed && s.keyCode === s.DOWN_ARROW) {
      ship.x -= Math.cos(ship.angle) * 5;
      ship.y -= Math.sin(ship.angle) * 5;
    }
    s.background(100);
    s.rect(s.width / 4, s.height / 4, 100, 30);
    shipLogic();
  };
});

export default App;
