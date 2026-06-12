import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutServices from "../components/AboutServices";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-[88px]">
        <Hero />
        <AboutServices />
      </main>
    </>
  );
}