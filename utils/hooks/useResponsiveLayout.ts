import { useEffect, useState } from "react";
import { UI_CONSTANTS } from "@/utils/constants/AppConstants";

export const useResponsiveLayout = () => {
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width <= UI_CONSTANTS.MOBILE_BREAKPOINT);
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return { windowWidth, isMobile };
};
