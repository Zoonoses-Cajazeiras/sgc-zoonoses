import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutServices from "../components/AboutServices";
import Stats from "../components/Stats";
import Castramovel from "../components/Castramovel";
import Faq from "../components/Faq";
import Footer from "../components/Footer";
import Campaigns from "../components/Campaigns";


export default function Home() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden pt-20">
        <Hero />
        <AboutServices />
        <Stats />
        <Castramovel />
        <Faq />
        <Footer />
      </main>
    </>
  );
}