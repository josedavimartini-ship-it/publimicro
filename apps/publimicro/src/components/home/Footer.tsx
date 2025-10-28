export default function Footer(): JSX.Element {
  return (
    <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
      <p>
        © {new Date().getFullYear()} Publimicro. Todos os direitos reservados.
      </p>
      <p className="mt-2 text-gray-500">
        Desenvolvido com excelência por Publimicro Digital Systems.
      </p>
    </footer>
  );
}
