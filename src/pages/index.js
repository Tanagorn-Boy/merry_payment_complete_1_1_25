import { NavBar, Footer } from "@/components/NavBar";
import CardSection from "@/components/landing-page/card-section";
import StartMacthing from "@/components/landing-page/startmatching-section";
import HeaderSection from "@/components/landing-page/header-section";
import WhyMerrySection from "@/components/landing-page/whymarry";

export default function Homepage() {
  return (
    <>
      <NavBar />
      <HeaderSection />
      <WhyMerrySection />
      <CardSection />
      <StartMacthing />
      <Footer />
    </>
  );
}
