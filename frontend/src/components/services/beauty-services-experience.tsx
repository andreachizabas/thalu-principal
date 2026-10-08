"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import type { BeautyService, ServiceRequestPayload } from "@/types/services";
import { submitServiceRequest } from "@/services/beauty-services";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
const today = new Date().toISOString().slice(0, 10);

function whatsappUrl(payload: ServiceRequestPayload, service: BeautyService, id: string) {
  if (!whatsappNumber) return null;
  const message = `Hola, ThaLú. 💗\n\nQuiero solicitar un servicio de belleza a domicilio.\n\nNombre: ${payload.fullName}\nServicio: ${service.name}\nCiudad: ${payload.city}\nDirección: ${payload.address}\nBarrio: ${payload.neighborhood}\nTeléfono: ${payload.phone}\nFecha preferida: ${payload.preferredDate || "Por definir"}\nHora preferida: ${payload.preferredTime || "Por definir"}\nObservaciones: ${payload.notes || "Ninguna"}\nNúmero de solicitud: ${id}\n\nQuedo atenta a la confirmación de disponibilidad y precio. ¡Muchas gracias!`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function BeautyServicesExperience({ services }: { services: BeautyService[] }) {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<BeautyService | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ServiceRequestPayload>({ fullName: "", phone: "", city: "Manizales", address: "", neighborhood: "", serviceId: "" });
  const grouped = useMemo(() => ({ nails: services.filter((service) => service.category === "Uñas"), hair: services.filter((service) => service.category === "Cuidado capilar") }), [services]);

  function choose(service: BeautyService) {
    setSelected(service);
    setSubmitted(false);
    setError("");
    setForm((current) => ({ ...current, serviceId: service.id }));
    document.getElementById("solicitud")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!selected || !form.fullName.trim() || !/^3\d{9}$/.test(form.phone.replace(/\s/g, "")) || !form.address.trim() || !form.neighborhood.trim()) {
      setError("Completa tu nombre, un celular colombiano válido, ciudad, dirección, barrio y servicio."); return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitServiceRequest({ ...form, fullName: form.fullName.trim(), address: form.address.trim(), neighborhood: form.neighborhood.trim() });
      setRequestId(result.id); setSubmitted(true);
      const url = whatsappUrl(form, selected, result.id);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "No pudimos registrar la solicitud.");
    } finally { setIsSubmitting(false); }
  }

  const update = (key: keyof ServiceRequestPayload, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const renderCard = (service: BeautyService) => (
    <motion.article key={service.id} className="overflow-hidden rounded-[1.5rem] bg-ink text-ivory shadow-xl shadow-ink/15" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} whileHover={reduceMotion ? undefined : { y: -6 }}>
      <div className="aspect-[4/3] overflow-hidden bg-rosewood"><img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" /></div>
      <div className="p-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-salmon">{service.category}</p><h3 className="mt-2 font-display text-2xl font-semibold">{service.name}</h3><p className="mt-2 text-sm leading-6 text-ivory/75">{service.description}</p><p className="mt-4 text-sm font-semibold text-salmon">Consultar precio</p><button type="button" onClick={() => choose(service)} className="button-accent mt-5 w-full">Solicitar servicio</button></div>
    </motion.article>
  );

  return <>
    <section className="bg-ink px-5 py-20 text-ivory sm:py-28"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr]"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-salmon">Belleza a tu puerta</p><h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] text-salmon sm:text-7xl">Tu momento de belleza, sin salir de casa.</h1><p className="mt-6 max-w-xl text-base font-medium leading-7 text-ivory/80">Uñas perfectas, cabello a tu estilo y un espacio solo para ti. Llevamos la experiencia ThaLú hasta tu hogar.</p><a href="#servicios" className="button-accent mt-8">Explorar servicios</a><p className="mt-5 text-sm font-semibold text-ivory/60">Cobertura: Manizales y Villamaría, Caldas.</p></div><div className="grid grid-cols-2 gap-3"><img src="/images/thalu-beauty.png" alt="Manicure a domicilio" className="aspect-[3/4] w-full rounded-[1.5rem] object-cover" /><img src="/images/thalu-hair-mask.png" alt="Cuidado capilar a domicilio" className="mt-10 aspect-[3/4] w-full rounded-[1.5rem] object-cover" /></div></div></section>
    <section id="servicios" className="bg-salmon px-5 py-16 text-ink sm:py-24"><div className="mx-auto max-w-7xl"><p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">Nuestros servicios</p><h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">Un ritual pensado para acompañarte.</h2><h3 className="mt-12 font-display text-3xl font-semibold">Uñas</h3><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{grouped.nails.map(renderCard)}</div><h3 className="mt-14 font-display text-3xl font-semibold">Cuidado capilar</h3><div className="mt-5 grid gap-5 sm:grid-cols-2">{grouped.hair.map(renderCard)}</div></div></section>
    <section id="solicitud" className="bg-[#f5d3ce] px-5 py-16 text-ink sm:py-24"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-[0.24em] text-rosewood">Agenda tu domicilio</p><h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Cuéntanos cómo quieres vivir tu momento.</h2><p className="mt-5 text-sm font-medium leading-6">Enviaremos tu solicitud para confirmar disponibilidad, precio y condiciones. El envío no confirma automáticamente el servicio.</p><a href={whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, ThaLú. Quisiera recibir información sobre los servicios de belleza a domicilio.")}` : undefined} target="_blank" rel="noreferrer" className={`button-primary mt-6 ${whatsappNumber ? "" : "pointer-events-none opacity-50"}`}>Escribir por WhatsApp</a></div><form onSubmit={handleSubmit} className="rounded-[1.5rem] bg-ink p-5 text-ivory shadow-xl sm:p-8"><AnimatePresence mode="wait">{submitted ? <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8"><p className="text-sm font-bold uppercase tracking-[0.2em] text-salmon">Solicitud recibida</p><h3 className="mt-3 font-display text-4xl">Gracias por elegir ThaLú.</h3><p className="mt-4 text-sm leading-6 text-ivory/80">Tu número de solicitud es <strong className="text-salmon">{requestId}</strong>. Te contactaremos para confirmar disponibilidad y precio.</p>{whatsappUrl(form, selected!, requestId) ? <a href={whatsappUrl(form, selected!, requestId)!} target="_blank" rel="noreferrer" className="button-accent mt-6">Continuar en WhatsApp</a> : null}</motion.div> : <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2">Nombre completo<input required value={form.fullName} onChange={(event) => update("fullName", event.target.value)} className="service-input" placeholder="Tu nombre" /></label><label>Celular<input required inputMode="numeric" value={form.phone} onChange={(event) => update("phone", event.target.value)} className="service-input" placeholder="300 000 0000" /></label><label>Ciudad<select value={form.city} onChange={(event) => update("city", event.target.value)} className="service-input"><option>Manizales</option><option>Villamaría</option></select></label><label>Servicio<select required value={form.serviceId} onChange={(event) => { const service = services.find((item) => item.id === event.target.value); setSelected(service ?? null); update("serviceId", event.target.value); }} className="service-input"><option value="">Selecciona un servicio</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label><label>Barrio o sector<input required value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} className="service-input" /></label><label className="sm:col-span-2">Dirección<input required value={form.address} onChange={(event) => update("address", event.target.value)} className="service-input" /></label><label>Fecha preferida<input type="date" min={today} value={form.preferredDate ?? ""} onChange={(event) => update("preferredDate", event.target.value)} className="service-input" /></label><label>Hora preferida<input type="time" value={form.preferredTime ?? ""} onChange={(event) => update("preferredTime", event.target.value)} className="service-input" /></label><label className="sm:col-span-2">Indicaciones adicionales<textarea value={form.notes ?? ""} onChange={(event) => update("notes", event.target.value)} className="service-input min-h-24" placeholder="Referencias o detalles que debamos conocer" /></label>{error ? <p className="sm:col-span-2 text-sm font-semibold text-salmon">{error}</p> : null}<p className="sm:col-span-2 text-xs leading-5 text-ivory/60">Al enviar, autorizas que ThaLú use estos datos para gestionar tu solicitud y contactarte por WhatsApp comercial.</p><button disabled={isSubmitting} type="submit" className="button-accent sm:col-span-2">{isSubmitting ? "Registrando solicitud..." : "Enviar solicitud por WhatsApp"}</button></motion.div>}</AnimatePresence></form></div></section>
  </>;
}
