import * as React from "react";
import p5 from "p5";
// import Game from "./game";

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
  colors: {
    red: number;
    blue: number;
  };
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
  colors: {
    red: number;
    blue: number;
  };
}
let showOnce = true;

let clock = 0;

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => i);
}

//great algorithm on how to bias random numbers :)
// https://stackoverflow.com/questions/29325069/how-to-generate-random-numbers-biased-towards-one-value-in-a-range
function getRndBias(min: number, max: number, bias: number, influence: number) {
  var rnd = Math.random() * (max - min) + min, // random in range
    mix = Math.random() * influence; // random mixer
  return rnd * (1 - mix) + bias * mix; // mix full range and bias
}

interface GameStateI {
  health: number;
  asteroidsDestroyed: number;
  playing: boolean;
  showControls: boolean;
  death: string;
  difficulty: boolean;
}

let gloablDifficulty: boolean = false;
class App extends React.Component<any, GameStateI> {
  public myRef: React.RefObject<HTMLCanvasElement>;
  public myP5: p5;
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      asteroidsDestroyed: 0,
      health: 4,
      playing: true,
      showControls: false,
      death: "",
      difficulty: gloablDifficulty,
    };
  }

  Sketch = (s: p5) => {
    let asteroidsDestroyed: number = 0;
    let curRound: number = 0;
    let hits: number = 0;
    let specialAttackAmount: number = 10;
    let rapidFireAmount = 50;
    let singleAsteroid: asteroidI;
    let asteroids: asteroidI[] = [];
    let difficulty = this.state.difficulty;
    let howManyAsteroidsAtStart: number;
    if (!this.state.difficulty) {
      howManyAsteroidsAtStart = 5;
    } else {
      howManyAsteroidsAtStart = 30;
    }
    const bullets: bulletI[] = [];
    let bullet: bulletI;
    let ship: shipI;
    let deathHits: p5.Element;
    let deathMap: p5.Element;
    s.setup = () => {
      s.createCanvas(700, 700);
      s.background(100);
      deathHits = s.createP("ship broke from asteroid hits. restart");
      deathMap = s.createP("ship drifted too far off map! restart");
      deathHits.addClass("death");
      deathMap.addClass("death");
      deathHits.hide();
      deathMap.hide();
      ship = {
        x: s.width / 2,
        y: s.height / 2,
        angle: 220,
        speed: 5,
        angleChange: 3,
        hitpoints: this.state.health,
        thrust: -0.5,
      };
      singleAsteroid = {
        x: s.width / 4,
        y: s.height / 4,
        angle: 33,
        speed: 2,
        angleChange: 3,
        width: 100,
        hitpoints: 3,
        trajectory: getRndBias(20, 70, 45, 0.5),
        colors: {
          red: s.random(80, 120),
          blue: s.random(190, 230),
        },
      };
      makeAsteroids(howManyAsteroidsAtStart);
    };

    const makeAsteroids = (howmany: number, speedster?: boolean) => {
      for (let i = 0; i < howmany; i++) {
        let asteroid: asteroidI = {
          angle: s.random(0, 360),
          angleChange: s.random(-5, 5),
          hitpoints: 100,
          speed: getRndBias(0.5, 6.5, 3, 1),
          width: getRndBias(10, 400, 50, 1),
          trajectory: getRndBias(10, 80, 45, 0.9),
          x: 0,
          y: 0,
          colors: {
            red: s.random(50, 160),
            blue: s.random(150, 230),
          },
        };
        if (speedster) {
          asteroid.speed = 14;
        }
        let rnd = s.random(0, 100);
        if (rnd <= 50) {
          // (asteroid.x = s.random(0, s.width)),
          asteroid.x = getRndBias(-200, s.width, 0, 0.9);
          asteroid.y = s.random(-100, -300);
        } else if (rnd > 50) {
          asteroid.x = s.random(-100, -300);
          asteroid.y = getRndBias(-200, s.height, 0, 0.9);
        }
        // x: s.random(0, s.width),
        // y: s.random(-100, -300),
        //cuz why not concat sometimes?
        asteroids = asteroids.concat(asteroid);
      }
    };

    const shipLogic = () => {
      if (ship) {
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
      }
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

    const shoot = (shotgun?: boolean, special?: "breadth" | "depth") => {
      if (ship) {
        if (s.keyIsDown(32) || special) {
          let bulletRadians = (Math.PI * ship.angle) / 180;
          if (shotgun) {
            bulletRadians += s.random(-1, 1);
          }
          if (special === "breadth") {
            bulletRadians += getRndBias(-2, 2, 0, 1);
          } else if (special === "depth") {
            bulletRadians += getRndBias(-0.27, 0.27, 0, 0.5);
          }
          let bllt: bulletI = {
            x: ship.x,
            y: ship.y,
            speed: s.random(7, 12),
            radians: bulletRadians,
            colors: {
              red: getRndBias(180, 250, 240, 0.9),
              blue: getRndBias(60, 200, 120, 0.5),
            },
          };
          bullets.push(bllt);
        }
      }
    };

    const handleDirections = () => {
      handleLeft();
      handleRight();
      handleUp();
      handleDown();
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
        s.fill(astrd.colors.red, 0, astrd.colors.blue);
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

    const specialAttack = () => {
      if (s.keyIsDown(67) && specialAttackAmount > 0) {
        specialAttackAmount--;
        for (let i of range(0, 30)) {
          shoot(false, "breadth");
        }
      }
    };

    const rapidFire = () => {
      if (s.keyIsDown(86) && rapidFireAmount > 0) {
        console.log("v");
        rapidFireAmount--;
        for (let i of range(0, 40)) {
          console.log("rapid fire");
          shoot(false, "depth");
        }
      }
    };

    const resetGame = () => {
      if (s.keyIsDown(13)) {
        console.log("clearing");
        asteroids = [];
        ship = {
          x: s.width / 2,
          y: s.height / 2,
          angle: 220,
          speed: 5,
          angleChange: 3,
          hitpoints: this.state.health,
          thrust: -0.5,
        };
        this.setState({
          asteroidsDestroyed: 0,
          health: 4,
          playing: true,
          death: "",
        });
        asteroidsDestroyed = 0;
        curRound = 0;
        hits = 0;
        specialAttackAmount = 10;
        rapidFireAmount = 50;
        makeAsteroids(howManyAsteroidsAtStart);
      }
    };

    setInterval(() => {
      specialAttackAmount += 1 + curRound;
    }, 2500);

    setInterval(() => {
      rapidFireAmount += 6 + curRound * 2;
    }, 1100);

    // setInterval(() => {
    //   console.clear();
    // }, 1000);
    s.draw = () => {
      resetGame();
      // console.log(asteroids[0].x, asteroids[0].y);

      clock++;
      // logger();
      // setTimeout(() => {}, 200);
      if (ship) {
        handleThrust();
        handleDirections();
        increaseSpeed();
        decreaseSpeed();
        increaseAngleSpeed();
        decreaseAngleSpeed();
        specialAttack();
      }
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

      if (s.keyIsDown(70) && rapidFireAmount > 0) {
        rapidFireAmount--;
        shoot(false, "depth");
        shoot(false, "depth");
        shoot(false, "depth");
      }
      //growth more asteroids
      if (!this.state.difficulty) {
        if (clock % 15 === 0) {
          makeAsteroids(1 + curRound);
        }
      } else if (this.state.difficulty) {
        if (clock % 10 === 0) {
          makeAsteroids(1 + curRound);
        }
        if (clock % 40 === 0) {
          makeAsteroids(2 + curRound, true);
        }
        if (clock % 150 === 0) {
          makeAsteroids(3 + curRound, true);
        }
        if (clock % 300 === 0) {
          makeAsteroids(10 + curRound, true);
        }
        if (clock % 1000 === 0) {
          console.log("round");
          curRound++;
          makeAsteroids(22 + curRound * 2);
        }
      }

      //die broke
      if (this.state.health < 0) {
        ship = null;
        this.setState({ death: "death due to asteroid!" });
      }
      if (ship) {
        if (
          ship.x < -300 ||
          ship.x > s.width + 300 ||
          ship.y < -300 ||
          ship.y > s.height + 300
        ) {
          this.setState({ death: "death from drifting off map!" });
        }
      }

      for (let i = 0; i < asteroids.length; i++) {
        let astrd = asteroids[i];
        handleAsteroids(astrd, i);
      }
      for (let astr of asteroids) {
        if (ship) {
          if (
            ship.x < astr.x + astr.width / 2 &&
            ship.x > astr.x - astr.width / 2 &&
            ship.y < astr.y + astr.width / 2 &&
            ship.y > astr.y - astr.width / 2
          ) {
            ship.hitpoints -= 1;
            this.setState((prevState) => ({ health: prevState.health - 1 }));
            console.log(" ship hit");
          }
        }
      }
      for (let i = 0; i < bullets.length; i++) {
        let bllt = bullets[i];
        if (bllt) {
          for (let j = 0; j < asteroids.length; j++) {
            let astr = asteroids[j];
            //erase die kill
            if (astr.width < 13) {
              asteroids.splice(j, 1);
              asteroidsDestroyed++;
              this.setState((prevS) => ({
                asteroidsDestroyed: prevS.asteroidsDestroyed + 1,
              }));
            }
            //hit contact damage
            if (
              bllt.x < astr.x + astr.width / 2 &&
              bllt.x > astr.x - astr.width / 2 &&
              bllt.y < astr.y + astr.width / 2 &&
              bllt.y > astr.y - astr.width / 2
            ) {
              astr.width -= getRndBias(1, 50, 2, 0.9);
              hits++;
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
            s.fill(bllt.colors.red, 0, bllt.colors.blue);
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
  };

  componentDidMount() {
    this.myP5 = new p5(this.Sketch, this.myRef.current);
  }

  componentWillMount() {
    this.myP5 = null;
  }

  keyBoardRestart = (e) => {};

  render() {
    let difficulty = this.state.difficulty;
    return (
      <div
        onKeyPress={(e) => {
          console.log("e", e.key);
        }}
        className="gamecanvas"
        //@ts-ignore
        ref={this.myRef}
      >
        <div className="info">
          <p>
            asteroids destroyed :{" "}
            <span style={{ color: "purple" }}>
              {" "}
              {this.state.asteroidsDestroyed}
            </span>
          </p>
          <p>
            health : <span style={{ color: "gold" }}> {this.state.health}</span>
          </p>
          <button
            onClick={() => {
              this.setState({ showControls: !this.state.showControls });
            }}
            style={{ backgroundColor: "lightblue" }}
          >
            controls
          </button>
          <button
            onClick={() => {
              this.setState({ difficulty: !difficulty });
              gloablDifficulty = !gloablDifficulty;
              console.log("dfclty", gloablDifficulty);
            }}
          >
            difficulty : {difficulty ? "crazy" : "normal"}
          </button>
          {this.state.death ? (
            <h3 style={{ marginLeft: "3px", color: "red" }}>
              {this.state.death}
            </h3>
          ) : (
            ""
          )}
          {this.state.showControls ? (
            <div className="controlpanel">
              <div>
                {/* <p>
                  {" "}
                  <span className="button">button</span>{" "}
                  <span className="description"> description</span>{" "}
                </p> */}
                <div className="spacer">
                  <p>
                    {" "}
                    <span className="buttonmain">button</span>{" "}
                    <span className="descriptionmain"> effect</span>{" "}
                  </p>
                </div>
                <p>
                  {" "}
                  <span className="button">enter</span>{" "}
                  <span className="description"> restart game</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">w</span>{" "}
                  <span className="description"> speed up</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">s</span>{" "}
                  <span className="description"> slow down</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">e</span>{" "}
                  <span className="description"> inc turn speed</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">q</span>{" "}
                  <span className="description"> dec turn speed</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">f</span>{" "}
                  <span className="description"> depth attack</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">c</span>{" "}
                  <span className="description"> breadth attack</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">space</span>{" "}
                  <span className="description"> regular attack</span>{" "}
                </p>
                <p>
                  {" "}
                  <span className="button">arrows</span>{" "}
                  <span className="description"> steer</span>{" "}
                </p>
                <br />
                {/* <div className="note">
                  note, both special attacks recharge overtime
                </div> */}
                <div className="note">
                  <React.Fragment>note, both special attacks</React.Fragment>
                  <br />
                  <React.Fragment>recharge overtime</React.Fragment>
                  <hr />
                  <React.Fragment>click the "controls" button</React.Fragment>
                  <br />
                  <React.Fragment> again to close this window</React.Fragment>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default App;
