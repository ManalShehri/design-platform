import { useState } from "react";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Create from "./pages/Create.jsx";
import "./index.css";

export default function App() {
  const [started, setStarted] = useState(false);
  return (
    <div className="min-h-screen">
      <Header />
      {started ? <Create onBack={() => setStarted(false)} /> : <Home onStart={() => setStarted(true)} />}
    </div>
  );
}