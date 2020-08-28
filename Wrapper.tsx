import * as React from "react";
import App from "./App";

const Wrapper = () => {
  const [playing, setPlaying] = React.useState<boolean>(true);
  return <div>{playing ? <App /> : "resetting"}</div>;
};

export default Wrapper;
