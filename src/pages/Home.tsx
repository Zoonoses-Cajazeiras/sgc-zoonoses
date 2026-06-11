import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-28">
        <section className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#026B6D]">
              Protegendo a saúde animal e humana.
            </h1>

            <p className="mt-6 text-xl text-slate-600">
              Controle de zoonoses, castração, vacinação e bem-estar animal.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}