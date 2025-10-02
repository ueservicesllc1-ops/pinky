import { redirect } from 'next/navigation';

export default function PersonalizadasPage() {
  // Redirect to Spanish by default
  redirect('/es/personalizadas');
}
