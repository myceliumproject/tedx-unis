import { ImgHTMLAttributes } from "react";
import integrarseLogoImg from "/integrarse-white.svg";

export default function IntegraRSELogo({
  ...restProps
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={integrarseLogoImg}
      style={{ width: "9rem", objectFit: "contain" }}
      {...restProps}
    />
  );
}
