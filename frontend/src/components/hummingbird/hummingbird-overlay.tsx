"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { hummingbirdConfig as config } from "./config";

function createWing(color: number, side: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(side * 0.45, 0.2, side * 1.25, 0.32, side * 1.55, 0.02);
  shape.bezierCurveTo(side * 1.12, -0.38, side * 0.45, -0.35, 0, 0);
  const wing = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.08, side: THREE.DoubleSide, transparent: true, opacity: 0.92 }));
  wing.position.set(side * 0.18, 0.16, 0.05);
  wing.rotation.z = side * 0.12;
  return wing;
}

function createHummingbirdSprite() {
  const texture = new THREE.TextureLoader().load("/images/thalu-hummingbird.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(0.78, 1.16, 1);
  sprite.userData.wings = [sprite, sprite];
  sprite.userData.tail = sprite;
  return sprite;
}

function createHummingbird() {
  const bird = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: config.ink, roughness: 0.42, metalness: 0.28 });
  const salmon = new THREE.MeshStandardMaterial({ color: config.salmon, roughness: 0.5, metalness: 0.12 });
  const rose = new THREE.MeshStandardMaterial({ color: config.deepRose, roughness: 0.45, metalness: 0.18 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 12), salmon);
  body.scale.set(1.4, 0.72, 0.68); body.rotation.z = -0.16; bird.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 10), dark);
  head.position.set(-0.48, 0.16, 0); bird.add(head);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.72, 8), rose);
  beak.position.set(-0.98, 0.12, 0); beak.rotation.z = -Math.PI / 2; bird.add(beak);
  const tail = new THREE.Group();
  for (let index = -1; index <= 1; index += 1) { const feather = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.85, 6), dark); feather.position.set(0.62, index * 0.08, index * 0.08); feather.rotation.z = Math.PI / 2 + index * 0.12; tail.add(feather); }
  bird.add(tail);
  const leftWing = createWing(config.deepRose, -1); const rightWing = createWing(config.ink, 1);
  bird.add(leftWing, rightWing); bird.userData.wings = [leftWing, rightWing]; bird.userData.tail = tail; bird.scale.setScalar(0.44);
  return bird;
}

export function HummingbirdOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!config.enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current; if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" }); } catch { return; }
    const scene = new THREE.Scene(); const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100); camera.position.z = 10;
    scene.add(new THREE.AmbientLight(0xffffff, 2.2)); const light = new THREE.DirectionalLight(0xffd6d0, 2.8); light.position.set(-2, 4, 6); scene.add(light);
    const bird = createHummingbirdSprite(); scene.add(bird); let width = 1; let height = 1; let worldWidth = 10; const worldHeight = 6; let curve: THREE.CatmullRomCurve3 | null = null; let startedAt = performance.now(); let pauseUntil = 0; let frame = 0; let disposed = false;
    function resize() { width = window.innerWidth; height = window.innerHeight; worldWidth = Math.max(8, (width / height) * 6); camera.left = -worldWidth / 2; camera.right = worldWidth / 2; camera.top = worldHeight / 2; camera.bottom = -worldHeight / 2; camera.updateProjectionMatrix(); renderer.setPixelRatio(Math.min(window.devicePixelRatio, config.maxPixelRatio)); renderer.setSize(width, height, false); }
    function pointFromViewport(x: number, y: number) { return new THREE.Vector3((x / width - 0.5) * worldWidth, (0.5 - y / height) * worldHeight, 0); }
    function setPath(destination: THREE.Vector3, duration: number = config.flightDurationMs) { const start = bird.position.clone(); const direction = destination.clone().sub(start); const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize().multiplyScalar(Math.min(1.2, direction.length() * 0.25)); curve = new THREE.CatmullRomCurve3([start, start.clone().add(direction.multiplyScalar(0.32)).add(perpendicular), start.clone().add(direction.multiplyScalar(0.72)).sub(perpendicular), destination], false, "catmullrom", 0.55); startedAt = performance.now(); pauseUntil = performance.now() + duration; }
    function autoPath() { setPath(new THREE.Vector3((Math.random() * 2 - 1) * worldWidth * 0.36, (Math.random() * 2 - 1) * worldHeight * 0.34, 0)); }
    function click(event: MouseEvent) { setPath(pointFromViewport(event.clientX, event.clientY), 900); pauseUntil = performance.now() + config.clickPauseMs; }
    resize(); bird.position.set(-worldWidth * 0.3, worldHeight * 0.18, 0); autoPath(); window.addEventListener("resize", resize); document.addEventListener("click", click, { passive: true });
    function animate(now: number) { if (disposed) return; frame = requestAnimationFrame(animate); if (curve) { const progress = Math.min(1, (now - startedAt) / 900); const next = curve.getPointAt(progress); const previous = bird.position.clone(); bird.position.copy(next); const travel = next.clone().sub(previous); if (travel.lengthSq() > 0.00001) bird.rotation.z = THREE.MathUtils.lerp(bird.rotation.z, Math.atan2(travel.y, travel.x), 0.08); if (progress >= 1) { pauseUntil = now + config.clickPauseMs; curve = null; } } else if (now > pauseUntil) autoPath(); const wings = bird.userData.wings as THREE.Object3D[]; wings[0].rotation.y = Math.sin(now * 0.065) * 0.78 - 0.2; wings[1].rotation.y = -Math.sin(now * 0.065) * 0.78 + 0.2; (bird.userData.tail as THREE.Object3D).rotation.y = Math.sin(now * 0.004) * 0.12; bird.position.y += Math.sin(now * 0.0028) * 0.0008; renderer.render(scene, camera); }
    frame = requestAnimationFrame(animate);
    return () => { disposed = true; cancelAnimationFrame(frame); window.removeEventListener("resize", resize); document.removeEventListener("click", click); scene.traverse((object) => { if (object instanceof THREE.Mesh) { object.geometry.dispose(); const material = object.material; (Array.isArray(material) ? material : [material]).forEach((item) => item.dispose()); } }); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
