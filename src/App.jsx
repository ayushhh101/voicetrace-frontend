import { useEffect, useState } from "react";
import Home from "./pages/Home";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Install not available. Use 'Add to Home Screen'");
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(outcome);

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="bg-black text-white p-4 text-center">
        VoiceTrace 🎤
      </header>

      {/* Install Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleInstall}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          📲 Download App
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center">
        <Home />
      </main>

    </div>
  );
}

export default App;