import { useState } from "react";
import { Outlet } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";
import BottomNav from "../components/BottomNav";

export default function MobileLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#F8F6F0" }}
    >
      <MobileHeader onMenuToggle={() => setMenuOpen(!menuOpen)} />
      <main
        className="flex-grow"
        style={{
          paddingTop: "80px",
          paddingBottom: "88px",
        }}
      >
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
