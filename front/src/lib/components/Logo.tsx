import mushroomImg from "/mycelium.svg";

import { ImgHTMLAttributes } from "react";

export default function Logo({
  ...restProps
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img src={mushroomImg} style={{ width: "1rem" }} {...restProps} />;
}
