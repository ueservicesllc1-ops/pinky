import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to Spanish by default
  redirect('/es');
}