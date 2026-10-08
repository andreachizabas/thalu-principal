import { Reveal } from "@/components/animations/reveal";

const categories = [
  {
    title: "Maquillaje",
    text: "Color, textura y acabados para expresarte a tu manera.",
  },
  {
    title: "Skincare",
    text: "Rituales faciales pensados para cuidado diario y bienestar.",
  },
  {
    title: "Cuidado capilar",
    text: "Productos cosmeticos para acompanar brillo, suavidad y manejo.",
  },
];

export function HomeSections() {
  return (
    <>
      <section className="bg-ink px-5 py-20 text-ivory">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">
              Categorias
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-tight text-ivory md:text-6xl">
              Tres mundos de autocuidado en una boutique cercana.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {categories.map((category) => (
              <Reveal key={category.title}>
                <article className="min-h-64 rounded-[1.5rem] border border-salmon/28 bg-salmon p-7 text-ink shadow-xl shadow-black/20 transition-transform hover:-translate-y-1">
                  <h3 className="font-display text-4xl font-semibold text-ink">
                    {category.title}
                  </h3>
                  <p className="mt-5 text-base leading-7 text-ink/78">
                    {category.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="historia" className="bg-rosewood px-5 py-20 text-ink">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="aspect-[4/5] rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
          </Reveal>
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-ink/70">
              Nuestra historia
            </p>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-tight md:text-6xl">
              Bienvenida a ThaLu: belleza inspirada en el amor.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-ink/76">
              <p>
                Al crear ThaLu, quise disenar un espacio exclusivo para ti. Un
                lugar donde cada producto capilar, cada gota de skincare y cada
                toque de maquillaje no busquen cambiar quien eres, sino celebrar
                la obra de arte que ya eres.
              </p>
              <p>
                Quiero que sepas algo importante: no necesitas que nadie te haga
                sentir hermosa, porque tu brillo ya esta ahi. Mi mision es darte
                herramientas para que lo cuides, lo potencies y lo disfrutes.
                Cuidar de tu cabello y de tu piel no es vanidad; es un acto de
                amor propio que puedes regalarte cada dia.
              </p>
              <p className="font-semibold text-ink">
                Gracias por hacernos parte de tu tocador y de tu historia.
                Bienvenida a ThaLu: belleza creada para hacerte brillar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
