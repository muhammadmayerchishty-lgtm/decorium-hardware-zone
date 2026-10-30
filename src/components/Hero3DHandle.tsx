/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Sparkles, Box, ExternalLink } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/business.ts';

export interface HeroProductItem {
  id: string;
  title: string;
  category: string;
  finish: string;
  badge: string;
  image: string;
  description: string;
}

// Client's newly updated powerful product images from _raw folder
export const HERO_PRODUCTS: HeroProductItem[] = [
  {
    id: 'hero-01',
    title: 'Architectural Fluted Lever Handle',
    category: 'Door Handles',
    finish: 'Satin Brass & Polished Gold',
    badge: 'Latest Collection 2026',
    image: '/hero/hero-product-01.jpg',
    description: 'Precision ribbed lever body paired with a stepped bevel escutcheon rose for grand interior doors.',
  },
  {
    id: 'hero-02',
    title: 'Concealed Rose Signature Lever',
    category: 'Door Handles',
    finish: 'Rich Antique Brass',
    badge: 'Artisanal Craft',
    image: '/hero/hero-product-02.jpg',
    description: 'Minimalist sprung lever with hand-rubbed antique patina, engineered for seamless architectural integration.',
  },
  {
    id: 'hero-03',
    title: 'Precision Knurled Tactile Lever',
    category: 'Door Handles',
    finish: 'Gunmetal Black & Brass',
    badge: 'Modern Precision',
    image: '/hero/hero-product-03.jpg',
    description: 'Diamond diamond-knurled grip offering an exceptional tactile touch, contrast-accented in satin brass.',
  },
  {
    id: 'hero-04',
    title: 'Sculpted Backplate Architectural Lever',
    category: 'Plates & Escutcheons',
    finish: 'Hand-Aged Brass',
    badge: 'Heritage Suite',
    image: '/hero/hero-product-04.jpg',
    description: 'Elongated solid architectural plate with integrated euro-profile escutcheon and contoured lever.',
  },
  {
    id: 'hero-05',
    title: 'Minimalist Architectural Bar Lever',
    category: 'Door Handles',
    finish: 'Champagne Gold',
    badge: 'Pure Profile',
    image: '/hero/hero-product-05.jpg',
    description: 'Sleek horizontal rectilinear geometry with eased chamfer edges, machined from solid billet brass.',
  },
  {
    id: 'hero-06',
    title: 'Dual-Tone Contemporary Lever Set',
    category: 'Door Handles',
    finish: 'Polished Nickel & Satin Gold',
    badge: 'Dual-Tone',
    image: '/hero/hero-product-06.jpg',
    description: 'Striking dual-metal composition marrying polished nickel collar details with a brushed satin lever arm.',
  },
  {
    id: 'hero-07',
    title: 'Chamfered Solid Brass Cabinet Pull',
    category: 'Cabinet Handles',
    finish: 'Solid Satin Brass',
    badge: 'Architectural Cut',
    image: '/hero/hero-product-07.jpg',
    description: 'Substantial profile with precision-milled facets, designed for luxury kitchen cabinetry and wardrobes.',
  },
  {
    id: 'hero-08',
    title: 'Grand Entrance Architectural Pull Handle',
    category: 'Main Door Pulls',
    finish: 'Hand-Buffed Brass',
    badge: 'Statement Entrance',
    image: '/hero/hero-product-08.jpg',
    description: 'Towering solid brass pull handle engineered to provide commanding presence on bespoke entrance portals.',
  },
  {
    id: 'hero-09',
    title: 'Heavy Knurled Main Door Pull Bar',
    category: 'Main Door Pulls',
    finish: 'Dual-Tone Black & Brass',
    badge: 'Flagship Pull',
    image: '/hero/hero-product-09.jpg',
    description: 'Substantial industrial diamond grip with solid brass pedestal standoffs for executive pivot doors.',
  },
  {
    id: 'hero-10',
    title: 'Artisanal Dragonfly Sculptural Handle',
    category: 'Decorative Handles',
    finish: 'Antique Cast Brass',
    badge: 'Signature Statement',
    image: '/hero/dragonfly-handle.jpg',
    description: 'Hand-cast bespoke dragonfly silhouette with delicate wing detailing, creating an unforgettable entryway.',
  },
  {
    id: 'hero-11',
    title: 'Organic Sculptural Leaf Pull',
    category: 'Decorative Handles',
    finish: 'Warm Patina Brass',
    badge: 'Artisanal Series',
    image: '/hero/leaf-handle.jpg',
    description: 'Fluid natural leaf contours cast in solid brass, hand-finished to highlight organic vein textures.',
  },
  {
    id: 'hero-12',
    title: 'Heritage Equestrian Cast Knob',
    category: 'Knobs',
    finish: 'Aged Bronze & Brass',
    badge: 'Bespoke Accent',
    image: '/hero/horse-head-knob.jpg',
    description: 'Expressive sculpted equestrian motif providing distinguished character to study doors and cabinetry.',
  },
];

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
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 3D Canvas State
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFinish, setSelectedFinish] = useState<FinishOption>(FINISHES[0]);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const materialRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);

  const activeProduct = HERO_PRODUCTS[activeIdx];

  // Auto-advance photos every 6 seconds if not hovered and in photo mode
  useEffect(() => {
    if (viewMode !== 'photo' || isHovered) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [viewMode, isHovered]);

  const handlePrev = useCallback(() => {
    setIsImageLoaded(false);
    setActiveIdx((prev) => (prev - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsImageLoaded(false);
    setActiveIdx((prev) => (prev + 1) % HERO_PRODUCTS.length);
  }, []);

  const handleSelectThumb = (idx: number) => {
    if (idx !== activeIdx) {
      setIsImageLoaded(false);
      setActiveIdx(idx);
    }
  };

  // Three.js 3D Handle Scene (activated when user toggles to 3D mode)
  useEffect(() => {
    if (viewMode !== '3d') return;

    let isDisposed = false;
    let animationFrameId: number;
    let renderer: any;
    let scene: any;
    let camera: any;
    let handleGroup: any;
    let pmremGenerator: any;
    let roomEnvTexture: any;

    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let manualRotY = 0;
    let manualRotX = 0;
    const autoRotateSpeed = 0.005;

    const initThreeScene = async () => {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);

        if (isDisposed || !containerRef.current) return;

        const width = containerRef.current.clientWidth || 600;
        const height = containerRef.current.clientHeight || 500;

        scene = new THREE.Scene();
        sceneRef.current = scene;

        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0.5, 7.2);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;

        containerRef.current.replaceChildren(renderer.domElement);

        pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();
        const roomEnv = new RoomEnvironment();
        roomEnvTexture = pmremGenerator.fromScene(roomEnv).texture;
        scene.environment = roomEnvTexture;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const topSpotlight = new THREE.SpotLight(0xffffff, 4.5, 30, Math.PI / 3.8, 0.45, 1.2);
        topSpotlight.position.set(0, 7.5, 3);
        scene.add(topSpotlight);

        const keyLight = new THREE.DirectionalLight(0xffeedd, 3.2);
        keyLight.position.set(4, 4, 4);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xe6c77a, 3.6);
        rimLight.position.set(-5, 2, -3);
        scene.add(rimLight);

        handleGroup = new THREE.Group();

        const brassMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(selectedFinish.hex),
          metalness: selectedFinish.metalness,
          roughness: selectedFinish.roughness,
          clearcoat: 0.35,
          clearcoatRoughness: 0.15,
          reflectivity: 0.95,
        });
        materialRef.current = brassMaterial;

        const accentMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(selectedFinish.hex),
          metalness: selectedFinish.metalness,
          roughness: Math.max(0.08, selectedFinish.roughness - 0.1),
          clearcoat: 0.5,
          clearcoatRoughness: 0.1,
          reflectivity: 1.0,
        });

        // Escutcheon Rose
        const roseOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.28, 0.18, 64), brassMaterial);
        roseOuter.rotation.x = Math.PI / 2;
        roseOuter.position.z = -0.5;
        handleGroup.add(roseOuter);

        const roseStep = new THREE.Mesh(new THREE.CylinderGeometry(0.98, 1.08, 0.12, 64), accentMaterial);
        roseStep.rotation.x = Math.PI / 2;
        roseStep.position.z = -0.38;
        handleGroup.add(roseStep);

        // Collar & Lever Arm
        const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.46, 0.7, 48), brassMaterial);
        collar.rotation.x = Math.PI / 2;
        collar.position.z = -0.05;
        handleGroup.add(collar);

        const leverArm = new THREE.Group();
        const mainBar = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.31, 3.2, 48), brassMaterial);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.set(1.6, 0, 0.32);
        leverArm.add(mainBar);

        const ribCount = 28;
        const ribGeom = new THREE.TorusGeometry(0.332, 0.016, 16, 48);
        for (let i = 0; i < ribCount; i++) {
          const rib = new THREE.Mesh(ribGeom, accentMaterial);
          rib.rotation.y = Math.PI / 2;
          rib.position.set(0.6 + (i * 2.2) / ribCount, 0, 0.32);
          leverArm.add(rib);
        }

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.15, 48), accentMaterial);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(3.26, 0, 0.32);
        leverArm.add(cap);

        handleGroup.add(leverArm);
        handleGroup.position.set(-0.65, 0, 0);
        handleGroup.rotation.set(0.2, -0.4, 0);
        scene.add(handleGroup);

        setIs3DLoaded(true);

        const canvas = renderer.domElement;
        const handlePointerDown = (e: PointerEvent) => {
          isDragging = true;
          previousPointerX = e.clientX;
          previousPointerY = e.clientY;
          canvas.setPointerCapture(e.pointerId);
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
          try {
            canvas.releasePointerCapture(e.pointerId);
          } catch {}
        };

        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);

        let lastTime = performance.now();
        const animate = (time: number) => {
          if (isDisposed) return;
          const delta = (time - lastTime) / 1000;
          lastTime = time;

          currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
          currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

          if (!isDragging) {
            manualRotY += autoRotateSpeed * (delta * 60);
          }

          if (handleGroup) {
            handleGroup.rotation.y = manualRotY + currentParallaxX;
            handleGroup.rotation.x = 0.2 + manualRotX + currentParallaxY;
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
      if (renderer) renderer.dispose();
      if (pmremGenerator) pmremGenerator.dispose();
      if (roomEnvTexture) roomEnvTexture.dispose();
    };
  }, [viewMode]);

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

  const whatsappInquiryUrl = buildWhatsAppUrl(
    `Hello DECORIUM Hardware Zone, I am interested in your flagship hardware: "${activeProduct.title}" (${activeProduct.finish}). Could you please share full specifications and pricing?`
  );

  return (
    <div
      className="relative w-full max-w-[980px] mx-auto select-none flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grand Architectural Stage */}
      <div className="relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[560px] rounded-[32px] bg-[#111113]/90 border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.85)] p-5 sm:p-8 flex flex-col justify-between overflow-hidden backdrop-blur-md">
        
        {/* Soft Radial Gold Spotlight Behind Active Hardware */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] bg-[#C9A24B]/16 rounded-full blur-[110px] pointer-events-none transition-all duration-700"
        />

        {/* Stage Top Navigation Bar */}
        <div className="relative z-20 flex items-center justify-between w-full">
          {/* Category & Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#C9A24B]/15 text-[#E6C77A] border border-[#C9A24B]/30 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 text-[#C9A24B]" />
              <span>{activeProduct.badge}</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-[#86868B] px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
              {activeProduct.category}
            </span>
          </div>

          {/* View Mode Toggle: Studio Photography vs 3D Interactive Model */}
          <div className="flex items-center p-1 rounded-full bg-[#1A1A1D] border border-white/[0.1] shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('photo')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'photo'
                  ? 'bg-gradient-to-r from-[#E6C77A] to-[#C9A24B] text-[#000000] shadow-md'
                  : 'text-[#A1A1A6] hover:text-[#F5F5F7]'
              }`}
            >
              <span>Photography</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === '3d'
                  ? 'bg-gradient-to-r from-[#E6C77A] to-[#C9A24B] text-[#000000] shadow-md'
                  : 'text-[#A1A1A6] hover:text-[#F5F5F7]'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Model</span>
            </button>
          </div>
        </div>

        {/* Stage Center Presentation */}
        <div className="relative z-10 my-auto w-full flex items-center justify-center py-4 min-h-[300px] sm:min-h-[360px]">
          {viewMode === 'photo' ? (
            <div className="relative w-full h-[300px] sm:h-[360px] flex items-center justify-center">
              {/* Previous Button */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous hardware product"
                className="absolute left-0 sm:left-2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C9A24B] text-[#F5F5F7] hover:text-black border border-white/10 hover:border-[#C9A24B] flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Large High-Definition Product Image */}
              <div className="w-full h-full flex items-center justify-center px-8 sm:px-14">
                <img
                  key={activeProduct.id}
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  onLoad={() => setIsImageLoaded(true)}
                  className={`max-h-[280px] sm:max-h-[340px] max-w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-all duration-500 ease-out ${
                    isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  } hover:scale-105`}
                />
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next hardware product"
                className="absolute right-0 sm:right-2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#C9A24B] text-[#F5F5F7] hover:text-black border border-white/10 hover:border-[#C9A24B] flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* 3D Interactive Three.js Handle */
            <div className="relative w-full h-[320px] sm:h-[380px] flex flex-col items-center justify-center">
              <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                title="Click and drag to rotate in 3D"
              />
              {!is3DLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#C9A24B]/30 border-t-[#C9A24B] rounded-full animate-spin" />
                </div>
              )}
              {/* Finish Chips in 3D Mode */}
              <div className="absolute bottom-1 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 z-20">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1A6]">Finish:</span>
                {FINISHES.map((fin) => (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() => handleSelectFinish(fin)}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      selectedFinish.id === fin.id
                        ? 'border-[#C9A24B] scale-125 ring-2 ring-[#C9A24B]/40'
                        : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: fin.hex }}
                    title={fin.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stage Bottom Information Bar */}
        <div className="relative z-20 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-heading font-semibold text-[#F5F5F7] tracking-tight">
                {activeProduct.title}
              </h2>
              <span className="text-xs text-[#86868B] font-mono">
                {String(activeIdx + 1).padStart(2, '0')}/{String(HERO_PRODUCTS.length).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1A6] mt-0.5 line-clamp-1 max-w-xl">
              {activeProduct.description} · <span className="text-[#C9A24B] font-medium">{activeProduct.finish}</span>
            </p>
          </div>

          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto min-h-[38px] px-4 py-1.5 rounded-full bg-[#1A1A1D] hover:bg-[#C9A24B] text-[#C9A24B] hover:text-black border border-[#C9A24B]/40 hover:border-[#C9A24B] text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
          >
            <span>Enquire this Piece</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Thumbnail Switcher Rail */}
      <div className="w-full mt-4 sm:mt-5 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center justify-start sm:justify-center gap-2.5 min-w-max px-2">
          {HERO_PRODUCTS.map((prod, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => handleSelectThumb(idx)}
                className={`group relative h-16 w-16 sm:h-18 sm:w-18 rounded-[16px] bg-[#111113] p-1.5 border transition-all duration-300 flex items-center justify-center overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-[#C9A24B] ring-2 ring-[#C9A24B]/30 scale-105 shadow-lg bg-[#18181C]'
                    : 'border-white/[0.08] hover:border-white/30 opacity-60 hover:opacity-100'
                }`}
                title={prod.title}
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
                {isActive && (
                  <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C9A24B]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
