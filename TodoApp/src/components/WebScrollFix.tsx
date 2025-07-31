// NÃO ESTÁ SENDO MAIS UTILIZADO //

import React from "react";
import { Platform } from "react-native";

const webScrollViewFixStyle = `
  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  /* O Expo Web envolve o app em uma div dentro do #root.
     Garantimos que essa div também ocupe 100% da altura e tenha rolagem. */
  #root > div {
    height: 100%;
    overflow: auto;
  }
`;

export const WebScrollFix = () => {
  if (Platform.OS !== "web") {
    return null;
  }

  return <style type="text/css">{webScrollViewFixStyle}</style>;
};
