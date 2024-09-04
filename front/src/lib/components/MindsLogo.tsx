import { ImgHTMLAttributes } from "react";
import mindsLogoImg from "/minds-white.svg";

export default function MindsLogo({
  ...restProps
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={mindsLogoImg}
      style={{ width: "9rem", objectFit: "contain" }}
      {...restProps}
    />
  );
}
