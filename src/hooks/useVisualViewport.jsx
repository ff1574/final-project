import { useState, useEffect } from "react";

export function useVisualViewport() {
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      const keyboardHeight = window.innerHeight - viewport.height;

      setViewportHeight(viewport.height);
      setIsKeyboardOpen(keyboardHeight > 150); // Threshold for keyboard detection
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportChange
      );
    };
  }, []);

  return { viewportHeight, isKeyboardOpen };
}
