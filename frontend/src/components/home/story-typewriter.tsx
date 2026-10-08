"use client";

import { RotateCcw, Volume2 } from "lucide-react";
import { useRef, useState } from "react";
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
const fallbackAudioDuration = 47.6;

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
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const effectiveCharacterCount = reduceMotion
    ? fullStoryText.length
    : characterCount;

  function syncTextWithAudio() {
    const audio = audioRef.current;

    if (!audio || reduceMotion) {
      return;
    }

    const duration = Number.isFinite(audio.duration)
      ? audio.duration
      : fallbackAudioDuration;
    const progress = Math.min(1, audio.currentTime / duration);

    setCharacterCount(Math.floor(fullStoryText.length * progress));
  }

  function playStory() {
    const audio = audioRef.current;

    setCharacterCount(0);
    setIsPlaying(true);

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.volume = 0.96;
    setNeedsManualPlay(false);

    void audio.play().catch(() => {
      setIsPlaying(false);
      setNeedsManualPlay(true);
    });
  }

  function finishStory() {
    setCharacterCount(fullStoryText.length);
    setIsPlaying(false);
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

      <audio
        ref={audioRef}
        preload="auto"
        src="/audio/thalu-historia.mp3"
        onTimeUpdate={syncTextWithAudio}
        onEnded={finishStory}
        onPlay={() => {
          setNeedsManualPlay(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
      />

      {needsManualPlay ? (
        <div className="mt-4 rounded-2xl border border-ink/15 bg-ivory/20 p-4">
          <p className="text-sm font-semibold text-ink">
            El navegador necesita que actives el audio desde los controles.
          </p>
          <audio
            className="mt-3 w-full"
            controls
            src="/audio/thalu-historia.mp3"
            onTimeUpdate={(event) => {
              const audio = event.currentTarget;
              const duration = Number.isFinite(audio.duration)
                ? audio.duration
                : fallbackAudioDuration;
              const progress = Math.min(1, audio.currentTime / duration);
              setCharacterCount(Math.floor(fullStoryText.length * progress));
            }}
            onPlay={() => setIsPlaying(true)}
            onEnded={finishStory}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      ) : null}

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
        {isPlaying
          ? "Estas escuchando la historia de ThaLu con la voz de su creadora."
          : "Puedes reproducir la historia cuando quieras."}
      </p>
    </div>
  );
}
