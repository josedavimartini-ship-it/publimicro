import { redirect } from 'next/navigation';

// Redirect to main posting form
export default function NewPropertyPage() {
  redirect('/postar');
}
