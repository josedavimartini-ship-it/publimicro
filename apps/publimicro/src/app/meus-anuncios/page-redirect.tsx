import { redirect } from 'next/navigation';

// Redirect to account page with listings tab
export default function MeusAnunciosPage() {
  redirect('/conta?tab=anuncios');
}
