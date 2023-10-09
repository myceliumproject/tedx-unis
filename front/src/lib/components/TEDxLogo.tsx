import tedxLogoImg from "/tedxfullwhite.svg";

import { ImgHTMLAttributes } from "react";

export default function TEDxLogo({
  ...restProps
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={tedxLogoImg}
      style={{ width: "9rem", objectFit: "contain" }}
      {...restProps}
    />
  );
}
