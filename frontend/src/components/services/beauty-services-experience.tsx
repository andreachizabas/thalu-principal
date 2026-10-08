"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { submitServiceRequest } from "@/services/beauty-services";
import type { BeautyService, ServiceRequestPayload } from "@/types/services";

const whatsappUrlBase = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/573122347352";
const today = new Date().toISOString().slice(0, 10);

function contactUrl(message: string) {
  return `${whatsappUrlBase}?text=${encodeURIComponent(message)}`;
}

export function BeautyServicesExperience({ services }: { services: BeautyService[] }) {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<BeautyService | null>(null);
  const [form, setForm] = useState<ServiceRequestPayload>({ fullName: "", phone: "", city: "Manizales", address: "", neighborhood: "", serviceId: "" });
  const [sent, setSent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (key: keyof ServiceRequestPayload, value: string) => setForm((current) => ({ ...current, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phone = form.phone.replace(/\s/g, "");
    if (!selected || !form.fullName.trim() || !/^3\d{9}$/.test(phone) || !form.address.trim() || !form.neighborhood.trim()) { setError("Completa nombre, celular colombiano, ciudad, dirección, barrio y servicio."); return; }
    setError(""); setLoading(true);
    try {
      const result = await submitServiceRequest({ ...form, phone });
      setSent(result.id);
      const message = `Hola, ThaLú. 💗\n\nQuiero solicitar un servicio de belleza a domicilio.\n\nNombre: ${form.fullName}\nServicio: ${selected.name}\nCiudad: ${form.city}\nDirección: ${form.address}\nBarrio: ${form.neighborhood}\nTeléfono: ${phone}\nFecha preferida: ${form.preferredDate || "Por definir"}\nHora preferida: ${form.preferredTime || "Por definir"}\nObservaciones: ${form.notes || "Ninguna"}\nNúmero de solicitud: ${result.id}`;
      window.open(contactUrl(message), "_blank", "noopener,noreferrer");
    } catch { setError("No pudimos registrar la solicitud. Intenta nuevamente."); } finally { setLoading(false); }
  }

  const card = (service: BeautyService) => <motion.article key={service.id} className="overflow-hidden rounded-[1.5rem] bg-ink text-ivory shadow-xl shadow-ink/15" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={reduceMotion ? undefined : { y: -6 }}><div className="aspect-[4/3] overflow-hidden"><img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-salmon">{service.category}</p><h3 className="mt-2 font-display text-2xl font-semibold">{service.name}</h3><p className="mt-2 text-sm leading-6 text-ivory/75">{service.description}</p><p className="mt-4 text-sm font-semibold text-salmon">Consultar precio</p><button type="button" onClick={() => { setSelected(service); setForm((current) => ({ ...current, serviceId: service.id })); document.getElementById("solicitud")?.scrollIntoView({ behavior: "smooth" }); }} className="button-accent mt-5 w-full">Solicitar servicio</button></div></motion.article>;
  const nails = services.filter((service) => service.category === "Uñas");
  const hair = services.filter((service) => service.category === "Cuidado capilar");

  return <>
    <section className="bg-ink px-5 py-20 text-ivory sm:py-28"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">Belleza a tu puerta</p><h1 className="mt-4 font-display text-5xl font-semibold leading-[0.95] text-salmon sm:text-7xl">Tu momento de belleza, sin salir de casa.</h1><p className="mt-6 max-w-xl text-base font-medium leading-7 text-ivory/80">Uñas perfectas, cabello a tu estilo y un espacio solo para ti. Llevamos la experiencia ThaLú hasta tu hogar.</p><a href="#servicios" className="button-accent mt-8">Explorar servicios</a><p className="mt-5 text-sm font-semibold text-ivory/60">Cobertura: Manizales y Villamaría, Caldas.</p></div><div className="grid grid-cols-2 gap-3"><img src="/images/thalu-beauty.png" alt="Manicure a domicilio" className="aspect-[3/4] w-full rounded-[1.5rem] object-cover" /><img src="/images/thalu-hair-mask.png" alt="Cuidado capilar a domicilio" className="mt-10 aspect-[3/4] w-full rounded-[1.5rem] object-cover" /></div></div></section>
    <section id="servicios" className="bg-salmon px-5 py-16 text-ink sm:py-24"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">Nuestros servicios</p><h2 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Un ritual pensado para acompañarte.</h2><h3 className="mt-12 font-display text-3xl font-semibold">Uñas</h3><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{nails.map(card)}</div><h3 className="mt-14 font-display text-3xl font-semibold">Cuidado capilar</h3><div className="mt-5 grid gap-5 sm:grid-cols-2">{hair.map(card)}</div></div></section>
    <section id="solicitud" className="bg-[#f5d3ce] px-5 py-16 text-ink sm:py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">Agenda tu domicilio</p><h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Cuéntanos cómo quieres vivir tu momento.</h2><p className="mt-5 text-sm leading-6">Enviaremos tu solicitud para confirmar disponibilidad, precio y condiciones.</p><a href={contactUrl("Hola, ThaLú. Quisiera recibir información sobre los servicios de belleza a domicilio.")} target="_blank" rel="noreferrer" className="button-primary mt-6">Escribir por WhatsApp</a></div><form onSubmit={submit} className="grid gap-4 rounded-[1.5rem] bg-ink p-5 text-ivory shadow-xl sm:grid-cols-2 sm:p-8"><label className="sm:col-span-2">Nombre completo<input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className="service-input" /></label><label>Celular<input required inputMode="numeric" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="service-input" placeholder="300 000 0000" /></label><label>Ciudad<select value={form.city} onChange={(event) => update("city", event.target.value)} className="service-input"><option>Manizales</option><option>Villamaría</option></select></label><label>Servicio<select required value={form.serviceId} onChange={(event) => { const service = services.find((item) => item.id === event.target.value) ?? null; setSelected(service); update("serviceId", event.target.value); }} className="service-input"><option value="">Selecciona un servicio</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label><label>Barrio o sector<input required value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} className="service-input" /></label><label className="sm:col-span-2">Dirección<input required value={form.address} onChange={(event) => update("address", event.target.value)} className="service-input" /></label><label>Fecha preferida<input type="date" min={today} value={form.preferredDate ?? ""} onChange={(event) => update("preferredDate", event.target.value)} className="service-input" /></label><label>Hora preferida<input type="time" value={form.preferredTime ?? ""} onChange={(event) => update("preferredTime", event.target.value)} className="service-input" /></label><label className="sm:col-span-2">Indicaciones adicionales<textarea value={form.notes ?? ""} onChange={(event) => update("notes", event.target.value)} className="service-input min-h-24" /></label>{error ? <p className="sm:col-span-2 text-sm font-semibold text-salmon">{error}</p> : null}{sent ? <p className="sm:col-span-2 text-sm font-semibold text-salmon">Solicitud {sent} registrada. Revisa WhatsApp para continuar.</p> : null}<button disabled={loading} type="submit" className="button-accent sm:col-span-2">{loading ? "Registrando solicitud..." : "Enviar solicitud por WhatsApp"}</button></form></div></section>
  </>;
}
