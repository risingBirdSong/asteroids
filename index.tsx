import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

const App = new p5((s: p5) => {
  const rotatedArray: number[][] = [];
  let ship: shipI = {
    x: 100,
    y: 100,
    angle: 1,
  };
  s.setup = () => {
    s.createCanvas(800, 800);
    s.background(100);
  };

  s.draw = () => {
    s.fill(10, 50, 230);
    s.translate(s.width / 2, s.height / 2);
    s.rotate(ship.angle);
    s.rect(ship.x, ship.y, 100, 20);
    rotatedArray.push([ship.x, ship.y]);
    ship.angle++;
  };
});

export default App;
