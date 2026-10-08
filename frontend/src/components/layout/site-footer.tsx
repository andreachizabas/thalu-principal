export function SiteFooter() {
  return (
    <footer className="bg-ink px-5 py-12 text-ivory">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-4xl font-semibold">ThaLú</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-ivory/70">
            Belleza colombiana seleccionada para rituales de autocuidado,
            maquillaje, skincare y cuidado capilar.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-salmon">
            Atencion
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ivory/70">
            <li>WhatsApp configurable</li>
            <li>Pedidos y envios</li>
            <li>Cambios y devoluciones</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-salmon">
            Legal
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ivory/70">
            <li>Privacidad</li>
            <li>Tratamiento de datos</li>
            <li>Terminos y condiciones</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
