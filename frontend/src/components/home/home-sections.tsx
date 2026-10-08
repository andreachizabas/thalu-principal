import { Reveal } from "@/components/animations/reveal";
import { StoryTypewriter } from "@/components/home/story-typewriter";

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
      <section className="bg-ink px-5 py-16 text-center text-ivory sm:py-20 md:text-left">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">
              Categorias
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-ivory sm:text-5xl md:mx-0 md:text-6xl">
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

      <section id="historia" className="bg-rosewood px-5 py-16 text-ink sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-10">
          <Reveal>
            <div className="mx-auto aspect-[4/5] max-h-[30rem] max-w-sm rounded-[2rem] bg-[url('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center md:max-h-none md:max-w-none" />
          </Reveal>
          <Reveal>
            <p className="text-center text-sm font-bold uppercase tracking-[0.24em] text-ink/70 lg:text-left">
              Nuestra historia
            </p>
            <StoryTypewriter />
          </Reveal>
        </div>
      </section>
    </>
  );
}
