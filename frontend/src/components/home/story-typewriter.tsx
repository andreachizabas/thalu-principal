"use client";

import { RotateCcw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type StorySegment = {
  kind: "title" | "paragraph" | "signature";
  text: string;
};

const storySegments: StorySegment[] = [
  {
    kind: "title",
    text: "ThaLu, un espacio creado para ti. ♡",
  },
  {
    kind: "paragraph",
    text: "ThaLu nació de un sueño: crear un espacio donde cada mujer encuentre inspiración para cuidarse, consentirse y resaltar su belleza a su manera.",
  },
  {
    kind: "paragraph",
    text: "Creemos que la belleza no se trata de cambiar quién eres, sino de celebrar lo que te hace única. Por eso, seleccionamos con cariño productos de diferentes marcas de maquillaje, cuidado facial y capilar, pensados para acompañarte en cada momento de tu rutina.",
  },
  {
    kind: "paragraph",
    text: "Porque más allá de un maquillaje, una piel cuidada o un cabello hermoso, queremos recordarte lo valiosa que eres y lo bonito que es dedicarte tiempo a ti misma.",
  },
  {
    kind: "signature",
    text: "ThaLu — Tu belleza, tu esencia, tu momento.",
  },
];

function getFullText() {
  return storySegments.map((segment) => segment.text).join("\n\n");
}

const fullStoryText = getFullText();

function getSegmentStart(segmentIndex: number) {
  return storySegments
    .slice(0, segmentIndex)
    .reduce((total, segment) => total + segment.text.length + 2, 0);
}

function getVisibleText(segmentIndex: number, characterCount: number) {
  const start = getSegmentStart(segmentIndex);
  const length = Math.max(0, characterCount - start);

  return storySegments[segmentIndex].text.slice(0, length);
}

function isActiveSegment(segmentIndex: number, characterCount: number) {
  const start = getSegmentStart(segmentIndex);
  const end = start + storySegments[segmentIndex].text.length;

  return characterCount >= start && characterCount <= end;
}

function pickSpanishVoice(voices: SpeechSynthesisVoice[]) {
  const spanishVoices = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith("es"),
  );

  return (
    spanishVoices.find((voice) =>
      /female|mujer|paulina|monica|mónica|luciana|helena|elena|sabina|paloma/i.test(
        voice.name,
      ),
    ) ??
    spanishVoices[0] ??
    voices[0]
  );
}

export function StoryTypewriter() {
  const reduceMotion = useReducedMotion();
  const [characterCount, setCharacterCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const effectiveCharacterCount = reduceMotion
    ? fullStoryText.length
    : characterCount;

  useEffect(() => {
    if (!isPlaying || reduceMotion) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCharacterCount((current) => {
        const next = Math.min(fullStoryText.length, current + 1);

        if (next >= fullStoryText.length) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          window.setTimeout(() => setIsPlaying(false), 0);
        }

        return next;
      });
    }, 34);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, reduceMotion]);

  function speakStory() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullStoryText);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = pickSpanishVoice(voices);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = selectedVoice?.lang ?? "es-CO";
    utterance.rate = 0.86;
    utterance.pitch = 1.12;
    utterance.volume = 0.78;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function playStory() {
    setCharacterCount(0);
    setIsPlaying(true);
    speakStory();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button className="button-primary" type="button" onClick={playStory}>
          <Volume2 size={18} />
          Escuchar historia
        </button>
        <button className="button-secondary" type="button" onClick={playStory}>
          <RotateCcw size={18} />
          Reiniciar
        </button>
      </div>

      <div
        className="mt-7 min-h-[30rem] max-w-3xl rounded-[1.5rem] border border-ink/15 bg-ivory/24 p-6 shadow-xl shadow-ink/10 md:p-8"
        aria-live="polite"
      >
        {storySegments.map((segment, index) => {
          const visibleText = getVisibleText(index, effectiveCharacterCount);

          if (!visibleText) {
            return null;
          }

          if (segment.kind === "title") {
            return (
              <h2
                key={segment.text}
                className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl"
              >
                {visibleText}
                {isPlaying && isActiveSegment(index, effectiveCharacterCount) ? (
                  <span className="ml-1 animate-pulse">|</span>
                ) : null}
              </h2>
            );
          }

          if (segment.kind === "signature") {
            return (
              <p
                key={segment.text}
                className="mt-5 font-display text-3xl font-semibold leading-tight text-ink"
              >
                {visibleText}
                {isPlaying && isActiveSegment(index, effectiveCharacterCount) ? (
                  <span className="ml-1 animate-pulse">|</span>
                ) : null}
              </p>
            );
          }

          return (
            <p key={segment.text} className="mt-5 text-lg leading-8 text-ink/78">
              {visibleText}
              {isPlaying && isActiveSegment(index, effectiveCharacterCount) ? (
                <span className="ml-1 animate-pulse">|</span>
              ) : null}
            </p>
          );
        })}

        {!isPlaying && !reduceMotion && characterCount === 0 ? (
          <p className="text-lg leading-8 text-ink/65">
            Presiona escuchar historia para descubrir el mensaje de ThaLu.
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-ink/58">
        {isSpeaking
          ? "La historia se esta leyendo con una voz suave del navegador."
          : "Puedes reproducir la historia cuando quieras."}
      </p>
    </div>
  );
}
