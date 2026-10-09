"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";
import { hummingbirdConfig as config } from "./config";

type FlowerTarget = { element: Element; position: THREE.Vector3 };
type FlightMode = "travel" | "hover" | "feed";

type FeatherSpec = { x: number; y: number; z: number; length: number; width: number; angle: number; color: number };

function createFeatherGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(-0.2, 0.43, -0.72, 0.47);
  shape.quadraticCurveTo(-0.96, 0.34, -1, 0);
  shape.quadraticCurveTo(-0.96, -0.34, -0.72, -0.47);
  shape.quadraticCurveTo(-0.2, -0.43, 0, 0);
  const geometry = new THREE.ShapeGeometry(shape, 10);
  const positions = geometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);
  for (let index = 0; index < positions.count; index += 1) {
    const edge = Math.min(1, Math.abs(positions.getY(index)) / 0.47);
    const sheen = 0.62 + (1 - edge) * 0.34;
    colors.set([sheen, sheen * 0.98, sheen * 0.94], index * 3);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createFeatherMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.34,
    metalness: 0.18,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
    sheen: 0.42,
    sheenColor: 0x9a526b,
    sheenRoughness: 0.36,
    iridescence: 0.75,
    iridescenceIOR: 1.28,
    iridescenceThicknessRange: [190, 520],
    side: THREE.DoubleSide,
  });
}

function createFeatherInstances(geometry: THREE.BufferGeometry, material: THREE.Material, specs: FeatherSpec[]) {
  const feathers = new THREE.InstancedMesh(geometry, material, specs.length);
  const transform = new THREE.Object3D();
  specs.forEach((feather, index) => {
    transform.position.set(feather.x, feather.y, feather.z);
    transform.rotation.set(0, 0, feather.angle);
    transform.scale.set(feather.length, feather.width, 1);
    transform.updateMatrix();
    feathers.setMatrixAt(index, transform.matrix);
    feathers.setColorAt(index, new THREE.Color(feather.color));
  });
  feathers.instanceMatrix.needsUpdate = true;
  if (feathers.instanceColor) feathers.instanceColor.needsUpdate = true;
  feathers.computeBoundingSphere();
  return feathers;
}

function createFeatherVanes(specs: FeatherSpec[], color: number) {
  const points: THREE.Vector3[] = [];
  for (const feather of specs) {
    const cos = Math.cos(feather.angle);
    const sin = Math.sin(feather.angle);
    const point = (distance: number) => new THREE.Vector3(
      feather.x - cos * distance * feather.length,
      feather.y - sin * distance * feather.length,
      feather.z + 0.012,
    );
    points.push(point(0.08), point(0.88));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  return new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.62, depthWrite: false }));
}

function createWing(geometry: THREE.BufferGeometry, featherMaterial: THREE.Material, shaftColor: number, baseColor: number, phase: number) {
  const wing = new THREE.Group();
  wing.userData.phase = phase;
  const outer = new THREE.Shape();
  outer.moveTo(0, 0);
  outer.bezierCurveTo(-0.28, 0.34, -0.7, 0.74, -1.12, 0.7);
  outer.bezierCurveTo(-0.96, 0.38, -0.64, 0.08, -0.16, -0.08);
  outer.closePath();
  const membrane = new THREE.Mesh(
    new THREE.ShapeGeometry(outer, 14),
    new THREE.MeshPhysicalMaterial({ color: baseColor, roughness: 0.38, metalness: 0.2, iridescence: 0.55, side: THREE.DoubleSide }),
  );
  membrane.position.z = -0.01;
  wing.add(membrane);

  const primaries: FeatherSpec[] = [];
  for (let index = 0; index < 9; index += 1) {
    const spread = index / 8;
    primaries.push({
      x: -0.02 - spread * 0.06,
      y: -0.045 + spread * 0.43,
      z: 0.025,
      length: 1.12 - Math.abs(spread - 0.42) * 0.28,
      width: 0.115,
      angle: 0.38 - spread * 0.84,
      color: index % 3 === 0 ? baseColor : index % 2 === 0 ? config.deepRose : config.ink,
    });
  }
  const secondaries: FeatherSpec[] = [];
  for (let index = 0; index < 7; index += 1) {
    const spread = index / 6;
    secondaries.push({
      x: -0.12 - spread * 0.45,
      y: 0.04 + spread * 0.24,
      z: 0.045,
      length: 0.48 + (1 - spread) * 0.18,
      width: 0.09,
      angle: 0.12 - spread * 0.16,
      color: index % 2 === 0 ? config.deepRose : baseColor,
    });
  }
  wing.add(createFeatherInstances(geometry, featherMaterial, primaries));
  wing.add(createFeatherInstances(geometry, featherMaterial, secondaries));
  wing.add(createFeatherVanes([...primaries, ...secondaries], shaftColor));
  return wing;
}

function createPhotorealBird(bodyTexture: THREE.Texture, wingTexture: THREE.Texture) {
  bodyTexture.colorSpace = THREE.SRGBColorSpace;
  wingTexture.colorSpace = THREE.SRGBColorSpace;

  const bird = new THREE.Group();
  const body = new THREE.Group();
  bird.add(body);

  const silhouette = new THREE.Sprite(new THREE.SpriteMaterial({
    map: bodyTexture,
    transparent: true,
    alphaTest: 0.025,
    depthWrite: false,
    toneMapped: false,
  }));
  silhouette.scale.set(3.1, 2.07, 1);
  silhouette.renderOrder = 2;
  body.add(silhouette);

  const wings = [
    { side: -1, phase: 0.16, size: 1.42, tint: 0xb9a4a6, opacity: 0.78, order: 1 },
    { side: 1, phase: 0, size: 1.5, tint: 0xffffff, opacity: 1, order: 3 },
  ].map(({ side, phase, size, tint, opacity, order }) => {
    const pivot = new THREE.Group();
    pivot.position.set(0.16, 0.12, side * 0.14);
    pivot.userData.phase = phase;
    pivot.userData.layers = [-0.42, 0, 0.42].map((phaseOffset, index) => {
      const blur = index !== 1;
      const wing = new THREE.Sprite(new THREE.SpriteMaterial({
        map: wingTexture,
        color: tint,
        transparent: true,
        opacity: opacity * (blur ? 0.2 : 0.8),
        alphaTest: 0.025,
        depthWrite: false,
        toneMapped: false,
      }));
      wing.center.set(0.95, 0.065);
      wing.scale.set(size * (blur ? 0.95 : 1), size * (blur ? 0.95 : 1), 1);
      wing.position.z = (index - 1) * 0.012;
      wing.renderOrder = order + index * 0.001;
      pivot.add(wing);
      return { sprite: wing, phaseOffset };
    });
    body.add(pivot);
    return pivot;
  });

  const head = new THREE.Group();
  head.position.set(1.43, 0.58, 0.22);
  body.add(head);
  const tongue = new THREE.Group();
  const tongueMaterial = new THREE.MeshStandardMaterial({ color: 0xd66d87, roughness: 0.36 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.007, 0.3, 6), tongueMaterial);
  stem.rotation.z = -Math.PI / 2;
  stem.position.x = 0.15;
  tongue.add(stem);
  for (const side of [-1, 1]) {
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.004, 0.1, 5), tongueMaterial);
    tip.position.set(0.29, side * 0.012, 0);
    tip.rotation.z = -Math.PI / 2 + side * 0.12;
    tongue.add(tip);
  }
  tongue.scale.x = 0.01;
  tongue.visible = false;
  head.add(tongue);

  const tail = new THREE.Group();
  const feet = new THREE.Group();
  body.add(tail, feet);
  bird.userData.body = body;
  bird.userData.wings = wings;
  bird.userData.tail = tail;
  bird.userData.head = head;
  bird.userData.headBaseX = 1.43;
  bird.userData.tongue = tongue;
  bird.userData.feet = feet;
  return bird;
}

function createBird(bodyTexture?: THREE.Texture, wingTexture?: THREE.Texture) {
  if (bodyTexture && wingTexture) return createPhotorealBird(bodyTexture, wingTexture);
  const bird = new THREE.Group();
  const body = new THREE.Group();
  bird.add(body);
  const featherGeometry = createFeatherGeometry();
  const featherMaterial = createFeatherMaterial();
  const bodyFeatherMaterial = createFeatherMaterial();
  const breastFeatherMaterial = createFeatherMaterial();
  const bodyBlack = new THREE.MeshPhysicalMaterial({ color: 0x21191d, roughness: 0.31, metalness: 0.18, clearcoat: 0.58, clearcoatRoughness: 0.24, iridescence: 0.5, iridescenceThicknessRange: [160, 420] });
  const pink = new THREE.MeshPhysicalMaterial({ color: 0xe69a91, roughness: 0.42, metalness: 0.05, sheen: 0.55, sheenColor: 0xe78b8e, sheenRoughness: 0.45 });
  const throatPink = new THREE.MeshPhysicalMaterial({ color: 0xa73f68, roughness: 0.23, metalness: 0.25, clearcoat: 0.72, clearcoatRoughness: 0.18, iridescence: 1, iridescenceIOR: 1.32, iridescenceThicknessRange: [280, 620] });
  const beakMaterial = new THREE.MeshPhysicalMaterial({ color: 0x25191d, roughness: 0.24, metalness: 0.24, clearcoat: 0.5 });

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.49, 36, 28), bodyBlack);
  torso.scale.set(1.3, 0.6, 0.57);
  torso.rotation.z = -0.12;
  body.add(torso);

  const breast = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 24), pink);
  breast.position.set(0.1, -0.09, 0.11);
  breast.scale.set(0.76, 0.68, 0.49);
  body.add(breast);

  const dorsalFeathers: FeatherSpec[] = [];
  for (const side of [-1, 1]) {
    for (let row = 0; row < 2; row += 1) {
      for (let index = 0; index < 7; index += 1) {
        dorsalFeathers.push({
          x: -0.42 + index * 0.105,
          y: row === 0 ? 0.2 : 0.095,
          z: side * (row === 0 ? 0.14 : 0.205),
          length: row === 0 ? 0.24 : 0.2,
          width: 0.074,
          angle: 0.08 + (index % 3) * 0.045,
          color: [0x20171d, 0x302027, 0x462430][(index + row) % 3],
        });
      }
    }
  }
  body.add(createFeatherInstances(featherGeometry, bodyFeatherMaterial, dorsalFeathers));
  body.add(createFeatherVanes(dorsalFeathers, 0x79515b));

  const breastFeathers: FeatherSpec[] = [];
  for (const side of [-1, 1]) {
    for (let row = 0; row < 3; row += 1) {
      for (let index = 0; index < 5; index += 1) {
        breastFeathers.push({
          x: -0.02 + index * 0.085 + row * 0.035,
          y: -0.08 - row * 0.075,
          z: side * (0.25 - row * 0.018),
          length: 0.16,
          width: 0.052,
          angle: -0.06 + (index % 2) * 0.1,
          color: [0xf0ada3, 0xe89991, 0xd98483][(index + row) % 3],
        });
      }
    }
  }
  body.add(createFeatherInstances(featherGeometry, breastFeatherMaterial, breastFeathers));

  const headPivot = new THREE.Group();
  headPivot.position.set(0.35, 0.23, 0);
  body.add(headPivot);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 32, 24), bodyBlack);
  head.scale.set(1.02, 0.91, 0.82);
  headPivot.add(head);

  const crownFeathers: FeatherSpec[] = [];
  for (let index = 0; index < 6; index += 1) {
    crownFeathers.push({ x: -0.2 + index * 0.065, y: 0.205, z: 0.035, length: 0.18, width: 0.045, angle: -0.04, color: index % 2 === 0 ? 0x352027 : 0x56303a });
  }
  headPivot.add(createFeatherInstances(featherGeometry, bodyFeatherMaterial, crownFeathers));

  const gorget = new THREE.Mesh(new THREE.SphereGeometry(0.2, 28, 20), throatPink);
  gorget.position.set(-0.01, -0.2, 0.17);
  gorget.scale.set(0.85, 0.62, 0.44);
  headPivot.add(gorget);
  const gorgetFeathers: FeatherSpec[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let index = 0; index < 4; index += 1) {
      gorgetFeathers.push({ x: -0.14 + index * 0.07, y: -0.14 - row * 0.035, z: 0.238, length: 0.12, width: 0.035, angle: -0.1, color: [0xb65279, 0xde8295, 0x923456][(index + row) % 3] });
    }
  }
  headPivot.add(createFeatherInstances(featherGeometry, featherMaterial, gorgetFeathers));

  const eyeBaseMaterial = new THREE.MeshPhysicalMaterial({ color: 0x09090b, roughness: 0.1, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 });
  const irisMaterial = new THREE.MeshStandardMaterial({ color: 0x79513e, roughness: 0.28, metalness: 0.12 });
  const pupilMaterial = new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.06, clearcoat: 1 });
  const eyeGeometry = new THREE.SphereGeometry(0.067, 20, 16);
  const irisGeometry = new THREE.SphereGeometry(0.046, 16, 12);
  const pupilGeometry = new THREE.SphereGeometry(0.027, 16, 12);
  const glintGeometry = new THREE.SphereGeometry(0.012, 10, 8);
  const glintMaterial = new THREE.MeshBasicMaterial({ color: 0xfff4e9 });
  for (const side of [1]) {
    const eye = new THREE.Mesh(eyeGeometry, eyeBaseMaterial);
    eye.position.set(0.04, 0.075, side * 0.25);
    eye.scale.set(1, 1, 0.72);
    headPivot.add(eye);
    const iris = new THREE.Mesh(irisGeometry, irisMaterial);
    iris.position.set(0.055, 0.078, side * 0.296);
    iris.scale.z = 0.52;
    headPivot.add(iris);
    const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
    pupil.position.set(0.06, 0.08, side * 0.318);
    pupil.scale.z = 0.56;
    headPivot.add(pupil);
    const glint = new THREE.Mesh(glintGeometry, glintMaterial);
    glint.position.set(0.046, 0.095, side * 0.331);
    headPivot.add(glint);
  }

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.027, 0.94, 12), beakMaterial);
  beak.position.set(0.72, 0.02, 0);
  beak.rotation.z = -Math.PI / 2;
  headPivot.add(beak);
  const lowerBeak = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.82, 10), beakMaterial);
  lowerBeak.position.set(0.66, -0.035, 0.008);
  lowerBeak.rotation.z = -Math.PI / 2;
  headPivot.add(lowerBeak);

  const tongue = new THREE.Group();
  const tongueMaterial = new THREE.MeshStandardMaterial({ color: 0xd66d87, roughness: 0.36, metalness: 0.06 });
  const tongueStem = new THREE.Mesh(new THREE.ConeGeometry(0.006, 0.28, 6), tongueMaterial);
  tongueStem.rotation.z = -Math.PI / 2;
  tongueStem.position.x = 0.13;
  tongue.add(tongueStem);
  for (const side of [-1, 1]) {
    const fork = new THREE.Mesh(new THREE.ConeGeometry(0.0038, 0.09, 5), tongueMaterial);
    fork.position.set(0.255, side * 0.014, 0);
    fork.rotation.z = -Math.PI / 2 + side * 0.13;
    tongue.add(fork);
  }
  tongue.position.set(1.14, -0.004, 0.025);
  tongue.scale.x = 0.01;
  tongue.visible = false;
  headPivot.add(tongue);

  const wings = [
    createWing(featherGeometry, featherMaterial, 0xdda0a3, 0x8a4d61, 0),
    createWing(featherGeometry, featherMaterial, 0x9d6f7c, 0x39252d, 0.18),
  ];
  wings[0].position.set(-0.13, 0.25, 0.2);
  wings[1].position.set(-0.13, 0.25, -0.2);
  body.add(...wings);

  const tail = new THREE.Group();
  tail.position.set(-0.54, -0.02, 0);
  const tailFeathers: FeatherSpec[] = [];
  for (let index = -3; index <= 3; index += 1) {
    tailFeathers.push({ x: 0, y: index * 0.038, z: index * 0.025, length: 0.9 - Math.abs(index) * 0.045, width: 0.105, angle: index * 0.075, color: index % 2 === 0 ? 0x21191f : 0x49303a });
  }
  tail.add(createFeatherInstances(featherGeometry, featherMaterial, tailFeathers));
  tail.add(createFeatherVanes(tailFeathers, 0x9a6874));
  body.add(tail);

  const feet = new THREE.Group();
  const footMaterial = new THREE.MeshStandardMaterial({ color: 0x302026, roughness: 0.42, metalness: 0.12 });
  for (const z of [-0.1, 0.1]) {
    const legCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, -0.29, z),
      new THREE.Vector3(-0.01, -0.37, z),
      new THREE.Vector3(-0.08, -0.4, z),
    ]);
    feet.add(new THREE.Mesh(new THREE.TubeGeometry(legCurve, 6, 0.014, 5, false), footMaterial));
    for (let toe = -1; toe <= 1; toe += 1) {
      const clawCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.08, -0.4, z),
        new THREE.Vector3(-0.12, -0.43, z + toe * 0.015),
        new THREE.Vector3(-0.08 + toe * 0.035, -0.45, z + toe * 0.025),
      ]);
      feet.add(new THREE.Mesh(new THREE.TubeGeometry(clawCurve, 5, 0.009, 4, false), footMaterial));
    }
  }
  body.add(feet);
  bird.userData.body = body;
  bird.userData.wings = wings;
  bird.userData.tail = tail;
  bird.userData.head = headPivot;
  bird.userData.headBaseX = 0.35;
  bird.userData.tongue = tongue;
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
    const plumageLight = new THREE.PointLight(0xa34a68, 1.1, 10);
    plumageLight.position.set(-2, 3, 3);
    scene.add(plumageLight);

    const textureLoader = new THREE.TextureLoader();
    const bodyTexture = textureLoader.load("/images/hummingbird-body.png");
    const wingTexture = textureLoader.load("/images/hummingbird-wing.png");
    const bird = createBird(bodyTexture, wingTexture);
    const mobile = window.matchMedia("(max-width: 640px)").matches;
    const initialScale = mobile ? config.mobileScale : config.desktopScale;
    bird.userData.baseScale = initialScale;
    bird.scale.setScalar(initialScale);
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
      const scale = width <= 640 ? config.mobileScale : config.desktopScale;
      bird.userData.baseScale = scale;
      bird.scale.setScalar(scale);
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
      const facing = flower.position.clone().sub(bird.position).normalize();
      const probeDistance = 1.5 * (bird.userData.baseScale as number);
      const hoverSpot = flower.position.clone().sub(facing.multiplyScalar(probeDistance));
      startFlight(hoverSpot, 1900 + Math.random() * 900, "feed", flower);
    }

    function turnToward(angle: number, delta: number, speed: number) {
      const facingLeft = Math.cos(angle) < 0;
      const uprightAngle = facingLeft ? angle - Math.PI : angle;
      const targetAngle = THREE.MathUtils.clamp(Math.atan2(Math.sin(uprightAngle), Math.cos(uprightAngle)), -0.48, 0.48);
      const difference = Math.atan2(Math.sin(targetAngle - bird.rotation.z), Math.cos(targetAngle - bird.rotation.z));
      bird.rotation.z += difference * Math.min(1, delta * speed);
      const targetScale = (bird.userData.baseScale as number) * (facingLeft ? -1 : 1);
      bird.scale.x += (targetScale - bird.scale.x) * Math.min(1, delta * speed * 1.6);
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
      const body = bird.userData.body as THREE.Group;
      const flapRate = mode === "feed" ? 0.32 : 0.29;
      wings.forEach((wing) => {
        const layers = wing.userData.layers as { sprite: THREE.Sprite; phaseOffset: number }[] | undefined;
        if (layers) {
          layers.forEach(({ sprite, phaseOffset }) => {
            const phase = now * flapRate + wing.userData.phase + phaseOffset;
            const wave = Math.sin(phase);
            const downstroke = wave >= 0 ? Math.pow(wave, 0.68) : -Math.pow(-wave, 1.22);
            sprite.rotation.z = downstroke * 0.78;
            sprite.rotation.x = Math.cos(phase) * 0.68;
            sprite.rotation.y = Math.sin(phase + 0.24) * 0.11;
          });
        } else {
          const phase = now * flapRate + wing.userData.phase;
          const wave = Math.sin(phase);
          const downstroke = wave >= 0 ? Math.pow(wave, 0.68) : -Math.pow(-wave, 1.22);
          wing.rotation.z = downstroke * 0.78;
          wing.rotation.x = Math.cos(phase) * 0.68;
          wing.rotation.y = Math.sin(phase + 0.24) * 0.11;
        }
      });
      const tail = bird.userData.tail as THREE.Group;
      const head = bird.userData.head as THREE.Group;
      const tongue = bird.userData.tongue as THREE.Group;
      tail.rotation.y = Math.sin(now * 0.0035) * 0.15;
      tail.rotation.z = mode === "travel" ? -0.06 : Math.sin(now * 0.004) * 0.035;

      if (mode === "travel" && path) {
        const raw = THREE.MathUtils.clamp((now - flightStarted) / flightDuration, 0, 1);
        const eased = raw * raw * (3 - 2 * raw);
        const next = path.getPointAt(eased);
        const travel = next.clone().sub(bird.position);
        bird.position.copy(next);
        if (travel.lengthSq() > 0.00001) {
          const facingAngle = Math.atan2(travel.y, travel.x);
          turnToward(facingAngle, delta, 5);
        }
        body.position.y = Math.sin(now * 0.007) * 0.008;
        body.rotation.z = -0.08 + Math.sin(now * 0.004) * 0.025;
        head.rotation.z = -body.rotation.z;
        if (raw >= 1) {
          path = null;
          mode = bird.userData.arrivalMode as FlightMode;
          pauseUntil = now + (mode === "feed" ? config.feedDurationMs : config.clickPauseMs);
          if (mode === "hover") nextTargetAt = pauseUntil;
          if (mode === "feed" && currentFlower) {
            const toFlower = currentFlower.position.clone().sub(bird.position);
            turnToward(Math.atan2(toFlower.y, toFlower.x), delta, 5);
          }
        }
      } else if (mode === "feed") {
        body.position.y = Math.sin(now * 0.009) * 0.018;
        body.rotation.z = 0.035 + Math.sin(now * 0.006) * 0.018;
        head.rotation.z = -body.rotation.z + Math.sin(now * 0.026) * 0.045;
        head.position.x = (bird.userData.headBaseX as number) + (Math.sin(now * 0.026) > 0.35 ? 0.035 : 0);
        if (currentFlower) {
          const toFlower = currentFlower.position.clone().sub(bird.position);
          turnToward(Math.atan2(toFlower.y, toFlower.x), delta, 4.5);
        }
        const tonguePulse = Math.max(0, Math.sin(now * 0.025));
        tongue.visible = tonguePulse > 0.02;
        tongue.scale.x = Math.max(0.01, tonguePulse);
        if (now > pauseUntil) {
          tongue.visible = false;
          tongue.scale.x = 0.01;
          head.rotation.z = -body.rotation.z;
          head.position.x = bird.userData.headBaseX as number;
          mode = "hover";
          currentFlower = null;
          nextTargetAt = now + 350;
        }
      } else {
        body.position.y = Math.sin(now * 0.007) * 0.014;
        body.rotation.z = Math.sin(now * 0.004) * 0.025;
        head.rotation.z = -body.rotation.z;
        head.position.x = bird.userData.headBaseX as number;
        tongue.visible = false;
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
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Sprite) {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      bodyTexture.dispose();
      wingTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
