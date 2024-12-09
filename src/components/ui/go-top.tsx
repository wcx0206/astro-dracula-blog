// https://dev.to/silviaespanagil/how-to-create-a-scroll-to-top-button-with-react-17do
import UpIcon from "@/components/icons/up";
import { useState, useEffect } from "react";

export default function GoTop() {
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
    showGoTop && (
      <button
        className="size-8 flex items-center justify-center fixed bottom-5 right-5
        bg-dracula-dark/20 hover:bg-dracula-dark transition"
        onClick={handleScrollUp}
      >
        <UpIcon />
      </button>
    )
  );
}
