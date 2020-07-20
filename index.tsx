import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

const App = new p5((s: p5) => {
  let ship: shipI = {
    x: 100,
    y: 100,
    angle: 0,
  };
  s.setup = () => {
    s.createCanvas(800, 800);
    s.background(100);
  };
  s.keyPressed = function () {
    if ((s.keyCode = s.UP_ARROW)) {
      ship.angle++;
    }
    console.log(s.keyCode);
  };
  s.draw = () => {
    s.fill(10, 50, 230);
    s.translate(s.width / 2, s.height / 2);
    s.rotate(ship.angle);
    s.rect(ship.x, ship.y, 100, 20);
  };
});

export default App;
