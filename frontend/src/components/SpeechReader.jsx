import { useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function SpeechReader({ text, lang = "ml-IN" }) {
  const [speaking, setSpeaking] = useState(false);

  const handleSpeak = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [text, lang, speaking]);

  return (
    <button
      onClick={handleSpeak}
      className="p-2 rounded-full transition-all duration-200"
      style={{
        background: speaking ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.08)",
        border: `1px solid ${speaking ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.1)"}`,
        color: speaking ? "#22c55e" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
      }}
      title={speaking ? "Stop" : "Listen"}
      aria-label={speaking ? "Stop reading" : "Read aloud"}
    >
      {speaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
}
