import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutServices from "../components/AboutServices";
import Castramovel from "../components/Castramovel";
import Faq from "../components/Faq";
import Footer from "../components/Footer";



export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-[88px]">
        <Hero />
        <AboutServices />
        <Castramovel />
        <Faq />
        <Footer />

      </main>
    </>
  );
}