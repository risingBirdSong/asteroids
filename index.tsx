import p5 from "p5";

interface shipI {
  x: number;
  y: number;
  angle: number;
}

console.log("force");
const App = new p5((s: p5) => {
  let ship: shipI = {
    x: 10,
    y: 10,
    angle: 1,
  };
  s.setup = () => {
    s.createCanvas(800, 800);
    // s.background(100);
  };

  const incXY = () => {
    ship.x++;
    ship.y++;
  };
  const blueSwirl = () => {
    s.translate(s.width / 2, s.height / 2);
    s.rotate(ship.angle);
    ship.angle++;
    s.fill(10, 50, 230);
    s.rect(ship.x, ship.y, 100, 5);
  };
  const redSwirl = () => {
    // s.translate(s.width / 2, s.height / 2);
    // s.rotate(ship.angle);
    ship.angle++;
    s.fill(250, 50, 100);
    s.rect(ship.x + 5, ship.y + 5, 100, 5);
  };
  const rotateShip = () => {};
  s.draw = () => {
    blueSwirl();
    redSwirl();
    incXY();
  };
});

export default App;
