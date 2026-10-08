"use client";

import { Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

type StorySegment = {
  kind: "title" | "paragraph" | "signature";
  text: string;
};

const storySegments: StorySegment[] = [
  {
    kind: "title",
    text: "ThaLú, un espacio creado para ti. ♡",
  },
  {
    kind: "paragraph",
    text: "ThaLú nació de un sueño: crear un espacio donde cada mujer encuentre inspiración para cuidarse, consentirse y resaltar su belleza a su manera.",
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
    text: "ThaLú — Tu belleza, tu esencia, tu momento.",
  },
];

function getFullText() {
  return storySegments.map((segment) => segment.text).join("\n\n");
}

const fullStoryText = getFullText();
const fallbackAudioDuration = 47.57;

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
  const animationFrameRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const isStoryVisibleRef = useRef(false);
  const timelineCurrentTimeRef = useRef(0);
  const timelineBaseTimeRef = useRef(0);
  const timelineStartedAtRef = useRef<number | null>(null);
  const effectiveCharacterCount = reduceMotion
    ? fullStoryText.length
    : characterCount;

  const stopTextSync = useCallback(() => {
    if (animationFrameRef.current === null) {
      return;
    }

    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const finishStory = useCallback(() => {
    hasCompletedRef.current = true;
    stopTextSync();
    timelineCurrentTimeRef.current = 0;
    timelineBaseTimeRef.current = 0;
    timelineStartedAtRef.current = null;
    setCharacterCount(fullStoryText.length);
    setIsPlaying(false);
  }, [stopTextSync]);

  const syncTextWithAudio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || reduceMotion) {
      return;
    }

    timelineCurrentTimeRef.current = audio.currentTime;
    timelineBaseTimeRef.current = audio.currentTime;
    if (timelineStartedAtRef.current !== null) {
      timelineStartedAtRef.current = performance.now();
    }

    const duration = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : fallbackAudioDuration;
    const progress = Math.min(1, timelineCurrentTimeRef.current / duration);

    setCharacterCount(Math.floor(fullStoryText.length * progress));
  }, [reduceMotion]);

  const startStoryTimeline = useCallback(
    (restart = false) => {
      const audio = audioRef.current;

      if (restart) {
        hasCompletedRef.current = false;
        timelineCurrentTimeRef.current = 0;
        timelineBaseTimeRef.current = 0;
        setCharacterCount(0);
      } else if (audio) {
        audio.currentTime = timelineCurrentTimeRef.current;
      }

      timelineStartedAtRef.current = performance.now();
      setIsPlaying(true);
      stopTextSync();

      function tick() {
        if (!isStoryVisibleRef.current) {
          animationFrameRef.current = null;
          return;
        }

        const currentAudio = audioRef.current;
        const isAudioRunning = Boolean(
          currentAudio && !currentAudio.paused && !currentAudio.ended,
        );
        const elapsed = timelineStartedAtRef.current === null
          ? 0
          : (performance.now() - timelineStartedAtRef.current) / 1000;

        if (isAudioRunning && currentAudio) {
          timelineCurrentTimeRef.current = currentAudio.currentTime;
          timelineBaseTimeRef.current = currentAudio.currentTime;
          timelineStartedAtRef.current = performance.now();
        } else {
          timelineCurrentTimeRef.current = timelineBaseTimeRef.current + elapsed;
        }

        const duration = currentAudio && Number.isFinite(currentAudio.duration) && currentAudio.duration > 0
          ? currentAudio.duration
          : fallbackAudioDuration;
        const progress = Math.min(1, timelineCurrentTimeRef.current / duration);

        setCharacterCount(Math.floor(fullStoryText.length * progress));

        if (progress >= 1) {
          finishStory();
          return;
        }

        animationFrameRef.current = requestAnimationFrame(tick);
      }

      animationFrameRef.current = requestAnimationFrame(tick);

      if (audio) {
        audio.volume = 0.96;
        void audio
          .play()
          .then(() => {
            if (isStoryVisibleRef.current && timelineCurrentTimeRef.current > 0) {
              audio.currentTime = timelineCurrentTimeRef.current;
            }
          })
          .catch(() => {
            // The timeline keeps running when a mobile browser blocks autoplay.
          });
      }
    },
    [finishStory, stopTextSync],
  );

  const stopStoryTimeline = useCallback(() => {
    const audio = audioRef.current;

    if (timelineStartedAtRef.current !== null) {
      timelineCurrentTimeRef.current = timelineBaseTimeRef.current +
        (performance.now() - timelineStartedAtRef.current) / 1000;
      timelineBaseTimeRef.current = timelineCurrentTimeRef.current;
    }

    timelineStartedAtRef.current = null;
    stopTextSync();

    if (audio && !audio.paused) {
      audio.pause();
    }

    setIsPlaying(false);
  }, [stopTextSync]);

  const playStory = useCallback(
    (restart = false) => {
      startStoryTimeline(restart);
    },
    [startStoryTimeline],
  );

  useEffect(() => {
    const story = storyRef.current;

    if (!story || reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isStoryReadable =
          entry.isIntersecting && entry.intersectionRatio >= 0.35;

        isStoryVisibleRef.current = isStoryReadable;

        if (isStoryReadable && !hasCompletedRef.current) {
          if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            playStory(true);
            return;
          }

          playStory(false);
          return;
        }

        if (!isStoryReadable) {
          stopStoryTimeline();
        }
      },
      { threshold: [0, 0.2, 0.35, 0.55] },
    );

    observer.observe(story);

    return () => {
      observer.disconnect();
      stopTextSync();
    };
  }, [playStory, reduceMotion, stopStoryTimeline, stopTextSync]);

  return (
    <div ref={storyRef} className="text-center lg:text-left">
      <motion.button
        className="relative mx-auto flex w-full max-w-xs items-center justify-center gap-4 overflow-hidden rounded-[1.5rem] border border-ink/20 bg-ink px-6 py-5 text-center text-ivory shadow-xl shadow-ink/20 lg:mx-0"
        type="button"
        aria-label="Sube el volumen para escuchar la historia de ThaLú"
        onClick={() => playStory(hasCompletedRef.current)}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.01 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.span
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(233,155,145,0.28),transparent_42%)]"
          animate={
            reduceMotion
              ? undefined
              : { opacity: [0.55, 0.95, 0.55], scale: [1, 1.04, 1] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-salmon text-ink">
          <motion.span
            className="absolute inset-0 rounded-full border border-salmon"
            animate={
              reduceMotion
                ? undefined
                : { opacity: [0.55, 0], scale: [1, 1.55] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <Volume2 size={24} />
        </span>
        <span className="relative text-left">
          <span className="block text-xs font-bold uppercase tracking-[0.28em] text-salmon">
            Sube el volumen
          </span>
          <span className="mt-2 flex h-5 items-end gap-1" aria-hidden="true">
            {[0.35, 0.7, 1, 0.55].map((height, index) => (
              <motion.span
                key={height}
                className="w-1.5 rounded-full bg-ivory/80"
                style={{ height: `${height * 1.25}rem` }}
                animate={
                  reduceMotion
                    ? undefined
                    : { scaleY: [0.55, 1, 0.65], opacity: [0.55, 1, 0.7] }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </span>
        </span>
      </motion.button>

      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onTimeUpdate={syncTextWithAudio}
        onLoadedMetadata={syncTextWithAudio}
        onEnded={finishStory}
        onPlay={() => {
          setIsPlaying(true);
        }}
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

      </div>
    </div>
  );
}
