import { redirect } from 'next/navigation';

// Root redirects to property listings (main landing page)
export default function RootPage() {
  redirect('/imoveis');
}
