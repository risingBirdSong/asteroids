import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

const App = new p5((s: p5) => {
  let ship: shipI = {
    x: 10,
    y: 1,
    angle: 1,
  };
  s.setup = () => {
    s.createCanvas(800, 800);
    s.frameRate(12);
    s.background(100);
  };

  s.draw = () => {
    s.background(100);
    s.fill(10, 50, 230);
    let withSin = Math.sin(ship.angle) * 20;
    let withTan = Math.tan(ship.angle) * 20;
    s.translate(s.width / 2 + withSin, s.height / 2 + withTan);
    s.ellipse(ship.x + withSin * 2, ship.y + withTan * 2, 30, 30);
    s.ellipse(ship.x + withSin, ship.y + withTan, 20, 20);
    s.ellipse(ship.x, ship.y, 15, 15);
    s.ellipse(ship.x - withSin / 2, ship.y - withTan / 2, 10, 10);
    ship.angle++;
  };
});

export default App;
