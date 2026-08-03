import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutServices from "../components/AboutServices";
import Campaigns from "../components/Campaigns";
import Stats from "../components/Stats";
import Castramovel from "../components/Castramovel";
import Faq from "../components/Faq";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden pt-24">
        <Hero />
        <AboutServices />
        <Campaigns />
        <Stats />
        <Castramovel />
        <Faq />
        <Footer />
      </main>
    </>
  );
}