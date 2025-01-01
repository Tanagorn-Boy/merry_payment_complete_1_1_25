import { NavBar } from "@/components/NavBar";
import { PreviewProfile } from "@/components/PreviewProfile";

export default function PreviewProfilePage() {
  return (
    <div>
      <nav className="nav-bar-section">
        <NavBar />
      </nav>
      <main className="preview-section">
        <PreviewProfile />
      </main>
    </div>
  );
}
