import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ThaLú By Andrea Chizabas",
    short_name: "ThaLú",
    description: "Belleza, autocuidado y servicios a domicilio para tus rituales.",
    start_url: "/",
    display: "standalone",
    background_color: "#e99b91",
    theme_color: "#111111",
    lang: "es-CO",
    icons: [
      { src: "/logo-favicon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo-favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
