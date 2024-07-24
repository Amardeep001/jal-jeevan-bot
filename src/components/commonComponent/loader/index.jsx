import React from "react";
import { RotatingLines, ThreeDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <RotatingLines
      strokeColor="grey"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  );
};

export const ThreeDotsLoader = () => {
  return (
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#3B2C29"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
};

export default Loader;
