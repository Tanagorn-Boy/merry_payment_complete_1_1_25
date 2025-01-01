import { NavBar } from "@/components/NavBar";
import { Profile } from "@/components/ProfileForm";
import { Footer } from "@/components/NavBar";

export default function ProfilePage() {
  return (
    <div>
      <nav className="nav-bar-section">
        <NavBar />
      </nav>
      <main className="info-section">
        <Profile />
      </main>
      <footer className="footer-section">
        <Footer />
      </footer>
    </div>
  );
}
