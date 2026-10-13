/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { PRODUCTS } from '../data/products.ts';
import SafeImage from './SafeImage.tsx';

interface FinishOption {
  id: string;
  name: string;
  hex: string;
  metalness: number;
  roughness: number;
}

const FINISHES: FinishOption[] = [
  { id: 'satin-brass', name: 'Brass', hex: '#C9A24B', metalness: 1.0, roughness: 0.25 },
  { id: 'antique-patina', name: 'Antique', hex: '#8F6F2A', metalness: 0.95, roughness: 0.38 },
  { id: 'gunmetal-black', name: 'Black', hex: '#1A1A1D', metalness: 0.85, roughness: 0.35 },
  { id: 'silver-steel', name: 'Silver', hex: '#CBD5E1', metalness: 0.95, roughness: 0.2 },
];

export default function Hero3DHandle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISHES[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to keep Three.js instances for dynamic updates
  const materialRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    // 1. Check prefers-reduced-motion and touch / mobile devices
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isTouchOrSmall = !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.innerWidth < 768;

    if (motionQuery.matches || isTouchOrSmall) {
      setPrefersReducedMotion(true);
      return;
    }

    // 2. Check WebGL support
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    let isDisposed = false;
    let animationFrameId: number;
    let renderer: any;
    let scene: any;
    let camera: any;
    let handleGroup: any;
    let pmremGenerator: any;
    let roomEnvTexture: any;

    // Mouse parallax tracking
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    // User manual drag rotation
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let manualRotY = 0;
    let manualRotX = 0;
    let autoRotateSpeed = 0.005;

    let handleScroll: (() => void) | null = null;
    let visibilityObserver: IntersectionObserver | null = null;

    // Dynamic lazy-load of Three.js and RoomEnvironment
    const initThreeScene = async () => {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);

        if (isDisposed || !containerRef.current) return;

        const width = containerRef.current.clientWidth || 500;
        const height = containerRef.current.clientHeight || 560;

        // Scene
        scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0.5, 7.2);
        camera.lookAt(0, 0, 0);

        // Renderer with high performance and transparent alpha on black
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Context loss / restored listeners
        const canvas = renderer.domElement;
        canvas.addEventListener('webglcontextlost', (e: Event) => {
          e.preventDefault();
        });
        canvas.addEventListener('webglcontextrestored', () => {
          initThreeScene();
        });

        containerRef.current.replaceChildren(canvas);

        // Setup PMREMGenerator and RoomEnvironment for metallic studio reflection
        pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const roomEnv = new RoomEnvironment();
        roomEnvTexture = pmremGenerator.fromScene(roomEnv).texture;
        scene.environment = roomEnvTexture;

        // Studio Lighting: Soft top spotlight, gold rim light, and faint gold glow behind piece
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // 1. Soft top spotlight
        const topSpotlight = new THREE.SpotLight(0xffffff, 4.5, 30, Math.PI / 3.8, 0.45, 1.2);
        topSpotlight.position.set(0, 7.5, 3);
        topSpotlight.castShadow = true;
        scene.add(topSpotlight);

        // 2. Warm directional key light
        const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
        keyLight.position.set(4, 4, 4);
        scene.add(keyLight);

        // 3. Gold rim light for silhouette edge definition on black
        const rimLight = new THREE.DirectionalLight(0xe6c77a, 3.6);
        rimLight.position.set(-5, 2, -3);
        scene.add(rimLight);

        // 4. Faint gold glow point light behind piece
        const goldGlow = new THREE.PointLight(0xc9a24b, 2.6, 12);
        goldGlow.position.set(0, 0, -2);
        scene.add(goldGlow);

        // --- PROCEDURAL 3D LUXURY ARCHITECTURAL DOOR HANDLE ---
        handleGroup = new THREE.Group();

        // Master physical brass material
        const brassMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(selectedFinish.hex),
          metalness: selectedFinish.metalness,
          roughness: selectedFinish.roughness,
          clearcoat: 0.35,
          clearcoatRoughness: 0.15,
          reflectivity: 0.95,
        });
        materialRef.current = brassMaterial;

        // Accent polished rim material
        const accentMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(selectedFinish.hex),
          metalness: selectedFinish.metalness,
          roughness: Math.max(0.08, selectedFinish.roughness - 0.1),
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
        });

        // 1. Backplate / Escutcheon Rose (Stepped circular bevel)
        const roseOuterGeom = new THREE.CylinderGeometry(1.22, 1.28, 0.18, 64);
        const roseOuter = new THREE.Mesh(roseOuterGeom, brassMaterial);
        roseOuter.rotation.x = Math.PI / 2;
        roseOuter.position.z = -0.5;
        roseOuter.castShadow = true;
        handleGroup.add(roseOuter);

        const roseStepGeom = new THREE.CylinderGeometry(0.98, 1.08, 0.12, 64);
        const roseStep = new THREE.Mesh(roseStepGeom, accentMaterial);
        roseStep.rotation.x = Math.PI / 2;
        roseStep.position.z = -0.38;
        roseStep.castShadow = true;
        handleGroup.add(roseStep);

        const roseInnerGeom = new THREE.CylinderGeometry(0.68, 0.74, 0.1, 48);
        const roseInner = new THREE.Mesh(roseInnerGeom, brassMaterial);
        roseInner.rotation.x = Math.PI / 2;
        roseInner.position.z = -0.28;
        roseInner.castShadow = true;
        handleGroup.add(roseInner);

        // 2. Central Pivot Collar
        const collarGeom = new THREE.CylinderGeometry(0.42, 0.46, 0.7, 48);
        const collar = new THREE.Mesh(collarGeom, brassMaterial);
        collar.rotation.x = Math.PI / 2;
        collar.position.z = -0.05;
        collar.castShadow = true;
        handleGroup.add(collar);

        const collarRingGeom = new THREE.TorusGeometry(0.46, 0.035, 24, 48);
        const collarRing = new THREE.Mesh(collarRingGeom, accentMaterial);
        collarRing.position.z = 0.15;
        handleGroup.add(collarRing);

        // 3. Horizontal Lever Arm Shaft with ribbed detailing
        const leverArm = new THREE.Group();

        // Neck connecting pivot collar to lever grip
        const neckGeom = new THREE.CylinderGeometry(0.35, 0.38, 0.65, 32);
        const neck = new THREE.Mesh(neckGeom, accentMaterial);
        neck.rotation.x = Math.PI / 2;
        neck.position.set(0, 0, 0.32);
        leverArm.add(neck);

        // Main cylindrical shaft
        const mainBarGeom = new THREE.CylinderGeometry(0.33, 0.31, 3.2, 48);
        const mainBar = new THREE.Mesh(mainBarGeom, brassMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.set(1.6, 0, 0.32);
        mainBar.castShadow = true;
        leverArm.add(mainBar);

        // Concentric ribs along the lever shaft
        const ribCount = 30;
        const ribGeom = new THREE.TorusGeometry(0.332, 0.016, 16, 48);
        for (let i = 0; i < ribCount; i++) {
          const rib = new THREE.Mesh(ribGeom, accentMaterial);
          rib.rotation.y = Math.PI / 2;
          rib.position.set(0.6 + (i * 2.2) / ribCount, 0, 0.32);
          leverArm.add(rib);
        }

        // Chamfered Finial End Cap
        const capGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.15, 48);
        const cap = new THREE.Mesh(capGeom, accentMaterial);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(3.26, 0, 0.32);
        leverArm.add(cap);

        const tipSphereGeom = new THREE.SphereGeometry(0.33, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const tipSphere = new THREE.Mesh(tipSphereGeom, brassMaterial);
        tipSphere.rotation.z = -Math.PI / 2;
        tipSphere.position.set(3.33, 0, 0.32);
        leverArm.add(tipSphere);

        handleGroup.add(leverArm);

        // Center handle group in viewing frustum
        handleGroup.position.set(-0.65, 0, 0);
        handleGroup.rotation.set(0.2, -0.4, 0);
        scene.add(handleGroup);

        setIsLoaded(true);

        // Parallax mouse movement handler
        const handleMouseMove = (e: MouseEvent) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const normX = (e.clientX - rect.left) / rect.width - 0.5;
          const normY = (e.clientY - rect.top) / rect.height - 0.5;
          targetParallaxX = normX * 0.35;
          targetParallaxY = -normY * 0.25;
        };

        // Pointer drag interaction handlers
        const handlePointerDown = (e: PointerEvent) => {
          isDragging = true;
          setIsInteracting(true);
          previousPointerX = e.clientX;
          previousPointerY = e.clientY;
          if (canvas) canvas.setPointerCapture(e.pointerId);
        };

        const handlePointerMove = (e: PointerEvent) => {
          if (!isDragging) return;
          const deltaX = e.clientX - previousPointerX;
          const deltaY = e.clientY - previousPointerY;
          previousPointerX = e.clientX;
          previousPointerY = e.clientY;

          manualRotY += deltaX * 0.008;
          manualRotX += deltaY * 0.006;
          manualRotX = Math.max(-0.6, Math.min(0.6, manualRotX));
        };

        const handlePointerUp = (e: PointerEvent) => {
          isDragging = false;
          setIsInteracting(false);
          if (canvas) {
            try {
              canvas.releasePointerCapture(e.pointerId);
            } catch {
              // noop
            }
          }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);
        canvas.addEventListener('pointercancel', handlePointerUp);

        // Scroll-driven rotation (no sticky pinning, rotates smoothly as page scrolls)
        let targetScrollRotY = window.scrollY * 0.0018;
        let currentScrollRotY = targetScrollRotY;

        handleScroll = () => {
          targetScrollRotY = window.scrollY * 0.0018;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Visibility observer to pause Three.js rendering when Hero is scrolled out of viewport
        let isCanvasVisible = true;
        if (containerRef.current) {
          visibilityObserver = new IntersectionObserver(
            ([entry]) => {
              isCanvasVisible = entry.isIntersecting;
            },
            { rootMargin: '100px' }
          );
          visibilityObserver.observe(containerRef.current);
        }

        // Window resize handler
        const handleResize = () => {
          if (!containerRef.current || !renderer || !camera) return;
          const newW = containerRef.current.clientWidth;
          const newH = containerRef.current.clientHeight;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        };
        window.addEventListener('resize', handleResize);

        // Smooth 60FPS animation loop
        let lastTime = performance.now();
        const animate = (time: number) => {
          if (isDisposed) return;

          // If hero has scrolled out of view, pause rendering to keep performance optimal
          if (!isCanvasVisible) {
            animationFrameId = requestAnimationFrame(animate);
            return;
          }

          const delta = (time - lastTime) / 1000;
          lastTime = time;

          // Parallax smooth interpolation
          currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
          currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

          // Scroll rotation smooth interpolation
          currentScrollRotY += (targetScrollRotY - currentScrollRotY) * 0.08;

          if (!isDragging) {
            manualRotY += autoRotateSpeed * (delta * 60);
          }

          if (handleGroup) {
            handleGroup.rotation.y = manualRotY + currentParallaxX + currentScrollRotY;
            handleGroup.rotation.x = 0.2 + manualRotX + currentParallaxY + currentScrollRotY * 0.12;
          }

          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
      } catch (err) {
        console.warn('Three.js failed to initialize gracefully:', err);
        setWebglSupported(false);
      }
    };

    initThreeScene();

    return () => {
      isDisposed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (handleScroll) window.removeEventListener('scroll', handleScroll);
      if (visibilityObserver) visibilityObserver.disconnect();
      if (renderer) renderer.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      if (roomEnvTexture) roomEnvTexture.dispose();
    };
  }, [prefersReducedMotion]);

  // Update material colors dynamically when user switches finish
  const handleSelectFinish = (finish: FinishOption) => {
    setSelectedFinish(finish);
    if (materialRef.current) {
      import('three').then((THREE) => {
        materialRef.current.color = new THREE.Color(finish.hex);
        materialRef.current.metalness = finish.metalness;
        materialRef.current.roughness = finish.roughness;
      });
    }
  };

  // Fallback view for touch devices or reduced motion: use tier 'ready' product
  if (!webglSupported || prefersReducedMotion) {
    const fallbackProduct =
      PRODUCTS.find((p) => p.tier === 'ready' && p.category === 'Handles') ||
      PRODUCTS.find((p) => p.tier === 'ready');

    return (
      <div className="relative w-full h-[440px] sm:h-[500px] flex items-center justify-center p-6 bg-[#121214] rounded-[28px] border border-white/[0.08] select-none shadow-2xl">
        <div className="w-full max-w-sm flex flex-col items-center justify-center text-center">
          {fallbackProduct && (
            <div className="w-56 mb-4">
              <SafeImage
                src={fallbackProduct.image}
                alt={fallbackProduct.name}
                productName={fallbackProduct.name}
                category={fallbackProduct.category}
                finish={fallbackProduct.finish}
                opaque={fallbackProduct.opaque}
                priority
              />
            </div>
          )}

          <div className="mt-2 text-center">
            <h3 className="text-xl font-heading font-semibold text-[#F5F5F7] mt-1">
              {fallbackProduct ? fallbackProduct.name : 'Ribbed Architectural Lever Handle'}
            </h3>
            <p className="text-sm text-[#A1A1A6] mt-1.5 leading-relaxed">
              {fallbackProduct
                ? fallbackProduct.description
                : 'Available in satin brass, antique, matte black and brushed silver finishes.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] md:h-[580px] flex flex-col justify-between select-none">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        title="Click and drag to rotate"
      />

      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
          <div className="w-8 h-8 border-2 border-[#C9A24B]/30 border-t-[#C9A24B] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
