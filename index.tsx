import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

console.log("force");
const App = new p5((s: p5) => {
  let ship: shipI;
  s.setup = () => {
    s.createCanvas(800, 800);
    s.background(100);
    s.frameRate(20);
    ship = {
      x: s.width / 2,
      y: s.height / 2,
      angle: -33,
    };
  };

  const shipLogic = () => {
    s.translate(ship.x, ship.y);
    s.rotate(s.radians(ship.angle));
    s.fill(150);
    s.rect(0, 0, 100, 10);
  };
  s.draw = () => {
    s.background(100);
    s.rect(s.width / 4, s.height / 4, 100, 30);
    shipLogic();
  };
});

export default App;
