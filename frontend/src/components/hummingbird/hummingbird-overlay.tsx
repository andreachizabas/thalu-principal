"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { hummingbirdConfig as config } from "./config";

type FlowerTarget = { element: Element; position: THREE.Vector3 };
type FlightMode = "travel" | "hover" | "feed";

function featherShape(length: number, width: number, color: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(-length * 0.24, width * 0.58, -length, width * 0.12);
  shape.quadraticCurveTo(-length * 0.72, 0, -length, -width * 0.12);
  shape.quadraticCurveTo(-length * 0.24, -width * 0.58, 0, 0);
  return new THREE.Mesh(
    new THREE.ShapeGeometry(shape, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.52, metalness: 0.12, side: THREE.DoubleSide }),
  );
}

function createWing(color: number, phase: number) {
  const wing = new THREE.Group();
  wing.userData.phase = phase;
  const outer = new THREE.Shape();
  outer.moveTo(0, 0);
  outer.bezierCurveTo(-0.18, 0.36, -0.78, 0.82, -1.22, 0.66);
  outer.bezierCurveTo(-1.1, 0.31, -0.66, -0.04, -0.1, -0.12);
  outer.closePath();
  wing.add(new THREE.Mesh(new THREE.ShapeGeometry(outer, 12), new THREE.MeshStandardMaterial({ color, roughness: 0.48, metalness: 0.16, side: THREE.DoubleSide })));

  for (let index = 0; index < 6; index += 1) {
    const plume = featherShape(0.74 + index * 0.075, 0.13, index % 2 === 0 ? color : config.deepRose);
    plume.position.set(-0.14 - index * 0.045, 0.08 + index * 0.09, 0.018 + index * 0.002);
    plume.rotation.z = 0.16 + index * 0.055;
    wing.add(plume);
  }
  return wing;
}

function createBird() {
  const bird = new THREE.Group();
  const bodyBlack = new THREE.MeshStandardMaterial({ color: config.ink, roughness: 0.38, metalness: 0.28 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xf1a197, roughness: 0.48, metalness: 0.12 });
  const throatPink = new THREE.MeshStandardMaterial({ color: config.salmon, roughness: 0.36, metalness: 0.28 });
  const beakMaterial = new THREE.MeshStandardMaterial({ color: 0x211819, roughness: 0.3, metalness: 0.38 });

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.49, 24, 18), bodyBlack);
  torso.scale.set(1.3, 0.6, 0.57);
  torso.rotation.z = -0.12;
  bird.add(torso);

  const breast = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 18), pink);
  breast.position.set(0.1, -0.09, 0.11);
  breast.scale.set(0.76, 0.68, 0.49);
  bird.add(breast);

  const headPivot = new THREE.Group();
  headPivot.position.set(0.35, 0.23, 0);
  bird.add(headPivot);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 18), bodyBlack);
  head.scale.set(1.02, 0.91, 0.82);
  headPivot.add(head);

  const throat = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), throatPink);
  throat.position.set(-0.01, -0.2, 0.17);
  throat.scale.set(0.85, 0.62, 0.44);
  headPivot.add(throat);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.046, 0.9, 12), beakMaterial);
  beak.position.set(0.72, 0.02, 0);
  beak.rotation.z = -Math.PI / 2;
  headPivot.add(beak);

  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.067, 16, 12), new THREE.MeshStandardMaterial({ color: 0x070707, roughness: 0.08, metalness: 0.04 }));
    eye.position.set(0.04, 0.075, side * 0.276);
    headPivot.add(eye);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    glint.position.set(0.06, 0.1, side * 0.326);
    headPivot.add(glint);
  }

  const wings = [createWing(config.deepRose, 0), createWing(config.ink, Math.PI)];
  wings[0].position.set(-0.13, 0.25, 0.2);
  wings[1].position.set(-0.13, 0.25, -0.2);
  bird.add(...wings);

  const tail = new THREE.Group();
  tail.position.set(-0.54, -0.02, 0);
  for (let index = -2; index <= 2; index += 1) {
    const tailFeather = featherShape(0.88 - Math.abs(index) * 0.08, 0.14, index % 2 === 0 ? config.ink : config.deepRose);
    tailFeather.position.set(0, index * 0.058, index * 0.045);
    tailFeather.rotation.z = Math.PI + index * 0.07;
    tail.add(tailFeather);
  }
  bird.add(tail);

  const feet = new THREE.Group();
  const footMaterial = new THREE.MeshStandardMaterial({ color: 0x24191a, roughness: 0.62 });
  for (const z of [-0.1, 0.1]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.018, 0.19, 7), footMaterial);
    leg.position.set(-0.02, -0.36, z);
    feet.add(leg);
  }
  bird.add(feet);
  bird.userData.wings = wings;
  bird.userData.tail = tail;
  bird.userData.head = headPivot;
  bird.userData.feet = feet;
  return bird;
}

export function HummingbirdOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!config.enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(0, 0, 12);
    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const keyLight = new THREE.DirectionalLight(0xffddd5, 2.5);
    keyLight.position.set(-3, 5, 7);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xe99b91, 1.4, 12);
    fillLight.position.set(3, -2, 4);
    scene.add(fillLight);

    const bird = createBird();
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    bird.scale.setScalar(mobile ? config.mobileScale : config.desktopScale);
    scene.add(bird);

    const flowers: FlowerTarget[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    let worldWidth = 10;
    let worldHeight = 8;
    let path: THREE.CatmullRomCurve3 | null = null;
    let flightStarted = performance.now();
    let flightDuration: number = config.flightDurationMs;
    let mode: FlightMode = "travel";
    let pauseUntil = 0;
    let nextTargetAt = 0;
    let currentFlower: FlowerTarget | null = null;
    let animationFrame = 0;
    let lastTime = performance.now();
    let disposed = false;
    let mutationTimer = 0;

    function viewportPoint(clientX: number, clientY: number) {
      return new THREE.Vector3((clientX / width - 0.5) * worldWidth, (0.5 - clientY / height) * worldHeight, 0);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      worldHeight = 8;
      worldWidth = Math.max(8, (width / height) * worldHeight);
      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = -worldHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.maxPixelRatio));
      renderer.setSize(width, height, false);
      bird.scale.setScalar(width <= 640 ? config.mobileScale : config.desktopScale);
      refreshFlowers();
    }

    function refreshFlowers() {
      const matching = new Set<Element>();
      document.querySelectorAll<HTMLElement>("[data-hummingbird-flower], [class*='thalu-blossom']").forEach((element) => matching.add(element));
      document.querySelectorAll<HTMLImageElement>("img[src*='thalu-blossom']").forEach((element) => matching.add(element));
      const visible = [...matching].map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, rect };
      }).filter(({ rect }) => rect.width > 12 && rect.height > 12 && rect.bottom > 0 && rect.top < height).slice(0, 5);

      flowers.splice(0, flowers.length, ...visible.map(({ element, rect }) => ({
        element,
        position: viewportPoint(
          THREE.MathUtils.clamp(rect.left + rect.width * 0.58, 18, width - 18),
          THREE.MathUtils.clamp(rect.top + rect.height * 0.48, 18, height - 18),
        ),
      })));
    }

    function startFlight(destination: THREE.Vector3, duration: number, arrivalMode: FlightMode, flower: FlowerTarget | null = null) {
      const start = bird.position.clone();
      const difference = destination.clone().sub(start);
      const sideBend = new THREE.Vector3(-difference.y, difference.x, 0).normalize().multiplyScalar(Math.min(1.05, difference.length() * 0.22));
      path = new THREE.CatmullRomCurve3([
        start,
        start.clone().add(difference.clone().multiplyScalar(0.28)).add(sideBend),
        start.clone().add(difference.clone().multiplyScalar(0.68)).sub(sideBend),
        destination,
      ], false, "catmullrom", 0.5);
      flightStarted = performance.now();
      flightDuration = duration;
      mode = "travel";
      currentFlower = flower;
      bird.userData.arrivalMode = arrivalMode;
    }

    function flyToFlower(flower: FlowerTarget) {
      const sign = flower.position.x > 0 ? 1 : -1;
      const facing = new THREE.Vector3(sign, 0.08, 0).normalize();
      const hoverSpot = flower.position.clone().sub(facing.clone().multiplyScalar(0.78));
      startFlight(hoverSpot, 1900 + Math.random() * 900, "feed", flower);
    }

    function autonomousFlight() {
      const eligible = flowers.filter((flower) => {
        const rect = flower.element.getBoundingClientRect();
        return rect.width > 0 && rect.bottom > 24 && rect.top < height - 24;
      });
      if (eligible.length > 0) {
        const options = eligible.filter((flower) => flower !== currentFlower);
        flyToFlower(options[Math.floor(Math.random() * Math.max(1, options.length))] ?? eligible[0]);
      } else {
        const x = (Math.random() * 2 - 1) * worldWidth * 0.32;
        const y = (Math.random() * 2 - 1) * worldHeight * 0.3;
        startFlight(new THREE.Vector3(x, y, 0), 2600 + Math.random() * 1700, "hover");
      }
    }

    function handleInteraction(event: MouseEvent) {
      const target = event.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;
      const point = viewportPoint(event.clientX, event.clientY);
      const direction = point.x > bird.position.x ? 1 : -1;
      const arrival = point.clone().sub(new THREE.Vector3(direction * 0.65, 0, 0));
      startFlight(arrival, 850, "hover");
    }

    function handleScroll() {
      refreshFlowers();
      if (mode === "feed" && currentFlower?.element) {
        const rect = currentFlower.element.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > height) {
          mode = "hover";
          currentFlower = null;
          path = null;
          nextTargetAt = performance.now() + 300;
        }
      }
    }

    resize();
    bird.position.set(-worldWidth * 0.22, -worldHeight * 0.18, 0.7);
    autonomousFlight();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleInteraction, { passive: true });
    const observer = new MutationObserver(() => {
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(refreshFlowers, 180);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function animate(now: number) {
      if (disposed) return;
      animationFrame = requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const wings = bird.userData.wings as THREE.Group[];
      const flapRate = mode === "feed" ? 0.12 : 0.105;
      wings.forEach((wing) => {
        const beat = Math.sin(now * flapRate + wing.userData.phase) * 1.05;
        wing.rotation.z = beat;
        wing.rotation.x = Math.sin(now * flapRate + wing.userData.phase) * 0.48;
      });
      (bird.userData.tail as THREE.Group).rotation.y = Math.sin(now * 0.004) * 0.12;
      const head = bird.userData.head as THREE.Group;

      if (mode === "travel" && path) {
        const raw = THREE.MathUtils.clamp((now - flightStarted) / flightDuration, 0, 1);
        const eased = raw * raw * (3 - 2 * raw);
        const next = path.getPointAt(eased);
        const travel = next.clone().sub(bird.position);
        bird.position.copy(next);
        if (travel.lengthSq() > 0.00001) {
          const facingAngle = Math.atan2(travel.y, travel.x);
          bird.rotation.z = THREE.MathUtils.lerp(bird.rotation.z, facingAngle, Math.min(1, delta * 5));
        }
        if (raw >= 1) {
          path = null;
          mode = bird.userData.arrivalMode as FlightMode;
          pauseUntil = now + (mode === "feed" ? config.feedDurationMs : config.clickPauseMs);
          if (mode === "hover") nextTargetAt = pauseUntil;
          if (mode === "feed" && currentFlower) {
            const toFlower = currentFlower.position.clone().sub(bird.position);
            bird.rotation.z = Math.atan2(toFlower.y, toFlower.x);
          }
        }
      } else if (mode === "feed") {
        bird.position.y += Math.sin(now * 0.009) * delta * 0.065;
        head.rotation.y = Math.sin(now * 0.018) * 0.12;
        head.position.x = 0.35 + (Math.sin(now * 0.024) > 0.15 ? 0.055 : 0);
        bird.rotation.z = THREE.MathUtils.lerp(bird.rotation.z, currentFlower && currentFlower.position.x > bird.position.x ? 0 : Math.PI, Math.min(1, delta * 3));
        if (now > pauseUntil) {
          head.rotation.y = 0;
          head.position.x = 0.35;
          mode = "hover";
          currentFlower = null;
          nextTargetAt = now + 350;
        }
      } else {
        bird.position.y += Math.sin(now * 0.0032) * delta * 0.035;
        head.rotation.y = 0;
        if (now > nextTargetAt) autonomousFlight();
      }

      renderer.render(scene, camera);
    }

    animationFrame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(mutationTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleInteraction);
      observer.disconnect();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
