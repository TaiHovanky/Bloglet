import { useState, useEffect } from "react"

export const SCROLL_DIRECTION_DOWN = "SCROLL_DIRECTION_DOWN"
export const SCROLL_DIRECTION_UP = "SCROLL_DIRECTION_UP"
export const SCROLL_DIRECTION_NONE = "SCROLL_DIRECTION_NONE"

export const useScrollDirection = (callback: any) => {
  const [lastYPosition, setLastYPosition] = useState(window.pageYOffset);

  const handleScroll = () => {
    if (window.pageYOffset === lastYPosition) return SCROLL_DIRECTION_NONE

    const direction = (() => {
      return lastYPosition < window.pageYOffset
        ? SCROLL_DIRECTION_DOWN
        : SCROLL_DIRECTION_UP;
    })()

    callback(direction)
    setLastYPosition(window.pageYOffset)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll)
  })
};
