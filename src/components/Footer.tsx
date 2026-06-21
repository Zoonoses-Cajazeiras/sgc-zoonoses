export default function Footer() {
  return (
    <footer
      id="contato"
      className="bg-white py-8"
    >
      <div className="max-w-5xl mx-auto px-8">

        <h2 className="text-3xl font-bold text-[#026B6D] mb-8">
          Informações de Contato
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          <div>
            <p>Email: zoonoses@cajazeiras.pb.gov.br</p>
            <p>Telefone: (83) XXXX-XXXX</p>
            <p>Cajazeiras - PB</p>
          </div>

          <div>
            <p>
              Horário de funcionamento:
            </p>

            <p>
              Segunda a Sexta
            </p>

            <p>
              07h às 11h e 13h às 17h
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}