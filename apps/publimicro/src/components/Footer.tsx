export default function Footer(): JSX.Element {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-300 py-6">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p>
          © {new Date().getFullYear()} Publimicro. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
