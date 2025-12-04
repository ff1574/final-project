import { useState, useRef, useEffect, useCallback } from "react";
import { App as AppSys } from "@capacitor/app";

export function useWebcam({ initialFacingMode = "user" } = {}) {
  const [facingMode, setFacingMode] = useState(initialFacingMode);
  const [cropParams, setCropParams] = useState({
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 0,
    sourceHeight: 0,
  });
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  // Memoize the setup function to stabilize its reference for useEffect
  const setupWebcam = useCallback(
    async (isMounted) => {
      if (!isMounted) return;

      setIsCameraReady(false);
      setCameraError(null);

      try {
        // Ensure previous stream is stopped
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        // FIX #1: Use the 'facingMode' state to allow camera switching
        const constraints = {
          video: {
            facingMode: facingMode,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
          videoRef.current.onloadedmetadata = () => {
            if (isMounted) {
              videoRef.current.play().catch((err) => {
                // Play can be interrupted, log error but don't crash
                console.error("Video play failed:", err);
              });
              setIsCameraReady(true);
              setIsSwitchingCamera(false);
            }
          };
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
        if (isMounted) {
          setCameraError(
            err.name + ": " + err.message || "Failed to access camera."
          );
          setIsCameraReady(false);
          setIsSwitchingCamera(false);
        }
      }
    },
    [facingMode]
  );

  // Main effect for initializing and cleaning up the camera and listeners
  useEffect(() => {
    let isMounted = true;
    let stateListenerHandle = null;

    const initialize = async () => {
      // FIX #2: Correctly handle the async listener registration
      stateListenerHandle = await AppSys.addListener(
        "appStateChange",
        ({ isActive }) => {
          if (!isMounted) return;
          if (isActive) {
            setupWebcam(isMounted); // Re-initialize camera when app returns to foreground
          } else {
            // Stop stream when app goes to background
            if (mediaStreamRef.current) {
              mediaStreamRef.current
                .getTracks()
                .forEach((track) => track.stop());
              mediaStreamRef.current = null;
              setIsCameraReady(false);
            }
          }
        }
      );
      // Initial camera setup
      await setupWebcam(isMounted);
    };

    initialize();

    // Cleanup function
    return () => {
      isMounted = false;
      if (stateListenerHandle) {
        stateListenerHandle.remove();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [setupWebcam]); // Effect depends on the memoized setupWebcam

  const switchCamera = useCallback(() => {
    setIsSwitchingCamera(true);
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  }, []);

  const captureFrame = useCallback(
    async (targetWidth = 640, targetHeight = 640) => {
      if (!videoRef.current || !isCameraReady) return null;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      let sourceX = 0,
        sourceY = 0,
        sourceWidth = videoWidth,
        sourceHeight = videoHeight;
      if (videoWidth > videoHeight) {
        sourceX = (videoWidth - videoHeight) / 2;
        sourceWidth = videoHeight;
      } else {
        sourceY = (videoHeight - videoWidth) / 2;
        sourceHeight = videoWidth;
      }

      setCropParams({ sourceX, sourceY, sourceWidth, sourceHeight });

      // Handle mirroring for front-facing camera during capture
      if (facingMode === "user") {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(
        video,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.9);
      });
    },
    [facingMode, isCameraReady]
  );

  const releaseCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  }, []);

  return {
    videoRef,
    facingMode,
    cropParams,
    isCameraReady,
    isSwitchingCamera,
    cameraError,
    switchCamera,
    captureFrame,
    releaseCamera,
  };
}
