import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export default function NavigationProgress() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const startProgress = useCallback(() => {
    setVisible(true);
    setProgress(0);

    // Quick ramp to ~30%
    const t1 = setTimeout(() => setProgress(30), 50);
    // Slower ramp to ~60%
    const t2 = setTimeout(() => setProgress(60), 300);
    // Crawl to ~80%
    const t3 = setTimeout(() => setProgress(80), 600);
    // Stall at ~90%
    const t4 = setTimeout(() => setProgress(90), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const completeProgress = useCallback(() => {
    setProgress(100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(hideTimer);
  }, []);

  useEffect(() => {
    const cleanupStart = startProgress();

    // Complete after a short delay to simulate page ready
    const completeTimer = setTimeout(() => {
      completeProgress();
    }, 400);

    return () => {
      cleanupStart();
      clearTimeout(completeTimer);
    };
  }, [location.pathname, startProgress, completeProgress]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <Progress
        value={progress}
        className="h-[3px] rounded-none bg-transparent [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-out"
      />
    </div>
  );
}
