import * as React from "react";
import App from "./App";

const Wrapper = () => {
  const [playing, setPlaying] = React.useState<boolean>(true);
  return (
    <div>
      {playing ? <App /> : "resetting"}
      {/* <button
        onClick={() => {
          setPlaying(false);
          setTimeout(() => {
            setPlaying(true);
          }, 100);
        }}
      >
        reset{" "}
      </button> */}
    </div>
  );
};

export default Wrapper;
