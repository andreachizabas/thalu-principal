"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
const fallbackAudioDuration = 47.57;
const typingSpeedFactor = 0.82;

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

export function StoryTypewriter() {
  const reduceMotion = useReducedMotion();
  const [characterCount, setCharacterCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const effectiveCharacterCount = reduceMotion
    ? fullStoryText.length
    : characterCount;

  const playStory = useCallback(() => {
    const audio = audioRef.current;

    setCharacterCount(0);
    setIsPlaying(true);

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.96;

    void audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, []);

  useEffect(() => {
    const story = storyRef.current;

    if (!story || reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          playStory();
        }
      },
      { threshold: 0.55 },
    );

    observer.observe(story);

    return () => observer.disconnect();
  }, [playStory, reduceMotion]);

  function syncTextWithAudio() {
    const audio = audioRef.current;

    if (!audio || reduceMotion) {
      return;
    }

    const duration = Number.isFinite(audio.duration)
      ? audio.duration
      : fallbackAudioDuration;
    const typingDuration = duration * typingSpeedFactor;
    const progress = Math.min(1, audio.currentTime / typingDuration);

    setCharacterCount(Math.floor(fullStoryText.length * progress));
  }

  function finishStory() {
    setCharacterCount(fullStoryText.length);
    setIsPlaying(false);
  }

  return (
    <div ref={storyRef} className="text-center lg:text-left">
      <div className="mx-auto flex w-full max-w-xs flex-col items-center rounded-[1.5rem] border border-ink/20 bg-ink px-6 py-5 text-center text-ivory shadow-xl shadow-ink/20 lg:mx-0">
        <span className="text-xs font-bold uppercase tracking-[0.28em] text-salmon">
          Sube el volumen
        </span>
        <span className="mt-2 text-sm leading-6 text-ivory/70">
          La historia comenzara automaticamente al llegar a esta seccion.
        </span>
      </div>

      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onTimeUpdate={syncTextWithAudio}
        onEnded={finishStory}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/audio/thalu-historia.ogg" type="audio/ogg" />
        <source src="/audio/thalu-historia.mp3" type="audio/mpeg" />
      </audio>

      <div
        className="mx-auto mt-7 min-h-[24rem] max-w-3xl rounded-[1.5rem] border border-ink/15 bg-ivory/24 p-5 text-left shadow-xl shadow-ink/10 sm:min-h-[27rem] md:p-8 lg:mx-0"
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
                className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl md:text-5xl"
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
                className="mt-5 font-display text-2xl font-semibold leading-tight text-ink sm:text-3xl"
              >
                {visibleText}
                {isPlaying && isActiveSegment(index, effectiveCharacterCount) ? (
                  <span className="ml-1 animate-pulse">|</span>
                ) : null}
              </p>
            );
          }

          return (
            <p
              key={segment.text}
              className="mt-5 text-base leading-7 text-ink/78 sm:text-lg sm:leading-8"
            >
              {visibleText}
              {isPlaying && isActiveSegment(index, effectiveCharacterCount) ? (
                <span className="ml-1 animate-pulse">|</span>
              ) : null}
            </p>
          );
        })}

        {!isPlaying && !reduceMotion && characterCount === 0 ? (
          <p className="text-lg leading-8 text-ink/65">
            La historia aparecera aqui mientras escuchas la voz de ThaLu.
          </p>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-ink/58">
        {isPlaying
          ? "La historia se esta reproduciendo."
          : "Si tu navegador bloquea el audio automatico, sube el volumen y recarga esta seccion."}
      </p>
    </div>
  );
}
