export default function Footer(): JSX.Element {
  return (
    <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm">
      <p>
        © {new Date().getFullYear()} ACHEME. All rights reserved.
      </p>
      <p className="mt-2 text-gray-500">
        Find For Me — Connecting the world, one discovery at a time.
      </p>
    </footer>
  );
}
