import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

const App = new p5((s: p5) => {
  let ship: shipI = {
    x: 1,
    y: 1,
    angle: 1,
  };
  s.setup = () => {
    s.createCanvas(800, 800);
    s.frameRate(30);
    s.background(100);
  };

  s.draw = () => {
    s.background(100);
    s.fill(10, 50, 230);
    let withSin = Math.sin(ship.angle) * 100;
    s.translate(s.width / 2 + withSin, s.height / 2);
    s.rect(ship.x, ship.y, 100, 20);
    ship.angle++;
  };
});

export default App;
