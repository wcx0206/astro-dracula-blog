// https://dev.to/silviaespanagil/how-to-create-a-scroll-to-top-button-with-react-17do
import UpIcon from "@/components/icons/up";
import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

export default function GoTop() {
  const shouldReduceMotion = useReducedMotion();
  const initialOpacity = shouldReduceMotion ? 1 : 0;
  const initialY = shouldReduceMotion ? 0 : 10;

  const [showGoTop, setShowGoTop] = useState(false);
  const handleVisibleButton = () => {
    setShowGoTop(window.scrollY > 100);
  };

  const handleScrollUp = () => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleVisibleButton);
    return () => window.removeEventListener("scroll", handleVisibleButton);
  }, []);

  return (
    <AnimatePresence>
      {showGoTop && (
        <motion.button
          initial={{ opacity: initialOpacity, y: initialY }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: initialOpacity, y: initialY }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="size-8 flex items-center justify-center fixed bottom-5 right-5
        bg-dracula-dark/20 hover:bg-dracula-dark transition"
          onClick={handleScrollUp}
        >
          <UpIcon />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
