'use client';

export default function Footer() {
  return (
    <footer className="bg-pink-500">
      <div className="mx-auto flex h-24 max-w-5xl items-center justify-center px-6">
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white">
          <a
            href="https://www.pinkyflanes.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:opacity-80"
          >
            PinkyFlames.com
          </a>
          <a
            href="/terminos"
            className="transition hover:opacity-80"
          >
            Términos y Condiciones
          </a>
          <a
            href="/politicas-envio"
            className="transition hover:opacity-80"
          >
            Políticas de Envío
          </a>
        </nav>
      </div>
      <div className="border-t border-white/20 py-3">
        <p className="text-center text-xs font-semibold text-white/80">
          Potenciado y diseñado por Freedom Labs · +1 551 301 4573
        </p>
      </div>
    </footer>
  );
}