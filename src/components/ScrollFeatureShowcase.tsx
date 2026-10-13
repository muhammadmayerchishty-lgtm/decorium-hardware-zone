/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useEffect, useState } from 'react';

export default function ScrollFeatureShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeMobileFinish, setActiveMobileFinish] = useState<'brass' | 'black'>('brass');

  // Three.js mutable refs
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const handleGroupRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const threeModuleRef = useRef<any>(null);

  // Colors to interpolate
  const BRASS_HEX = 0xc9a24b;
  const BLACK_HEX = 0x1a1a1d;

  useEffect(() => {
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isWide = window.innerWidth >= 1024;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsDesktop(isFine && isWide);
    setReducedMotion(reduced);

    const onResize = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Track scroll progress within the 200vh pinned container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (containerHeight <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / containerHeight));
      setScrollProgress(progress);

      // Update 3D rotation and color if active
      if (handleGroupRef.current && threeModuleRef.current && materialRef.current) {
        const THREE = threeModuleRef.current;
        const targetRotY = -0.6 + progress * 3.0;
        const targetRotX = 0.2 - progress * 0.4;
        handleGroupRef.current.rotation.y = targetRotY;
        handleGroupRef.current.rotation.x = targetRotX;

        // Smooth color interpolation between Brass and Black
        const brassColor = new THREE.Color(BRASS_HEX);
        const blackColor = new THREE.Color(BLACK_HEX);
        materialRef.current.color.lerpColors(brassColor, blackColor, progress);
        materialRef.current.roughness = 0.25 + progress * 0.12;
        materialRef.current.metalness = 1.0 - progress * 0.15;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Three.js scene only on desktop and when reduced-motion is not requested
  useEffect(() => {
    if (!isDesktop || reducedMotion || !canvasContainerRef.current) return;

    let isDisposed = false;
    let animId: number;

    const setupScene = async () => {
      try {
        const [THREE, { RoomEnvironment }] = await Promise.all([
          import('three'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);

        if (isDisposed || !canvasContainerRef.current) return;
        threeModuleRef.current = THREE;

        const width = canvasContainerRef.current.clientWidth || 550;
        const height = canvasContainerRef.current.clientHeight || 550;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0.4, 6.8);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        rendererRef.current = renderer;

        // Environment lighting
        const pmrem = new THREE.PMREMGenerator(renderer);
        scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        pmrem.dispose();

        // Directional Key Light
        const keyLight = new THREE.DirectionalLight(0xfff7e6, 3.6);
        keyLight.position.set(4, 6, 5);
        scene.add(keyLight);

        // Rim Light
        const rimLight = new THREE.DirectionalLight(0xb5d5ff, 2.5);
        rimLight.position.set(-4, -2, -3);
        scene.add(rimLight);

        // Gold Fill Light
        const goldFill = new THREE.PointLight(0xc9a24b, 1.8, 10);
        goldFill.position.set(0, 0, -2);
        scene.add(goldFill);

        // Handle Material
        const material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(BRASS_HEX),
          metalness: 1.0,
          roughness: 0.25,
          clearcoat: 0.35,
          clearcoatRoughness: 0.15,
          reflectivity: 0.95,
        });
        materialRef.current = material;

        // Procedural Lever Handle Group
        const handleGroup = new THREE.Group();
        handleGroupRef.current = handleGroup;

        // Escutcheon Rose Backplate
        const roseOuterGeom = new THREE.CylinderGeometry(1.2, 1.25, 0.18, 64);
        const roseOuter = new THREE.Mesh(roseOuterGeom, material);
        roseOuter.rotation.x = Math.PI / 2;
        roseOuter.position.z = -0.5;
        handleGroup.add(roseOuter);

        const roseStepGeom = new THREE.CylinderGeometry(0.95, 1.05, 0.12, 64);
        const roseStep = new THREE.Mesh(roseStepGeom, material);
        roseStep.rotation.x = Math.PI / 2;
        roseStep.position.z = -0.38;
        handleGroup.add(roseStep);

        // Pivot Collar
        const collarGeom = new THREE.CylinderGeometry(0.42, 0.46, 0.7, 48);
        const collar = new THREE.Mesh(collarGeom, material);
        collar.rotation.x = Math.PI / 2;
        collar.position.z = -0.05;
        handleGroup.add(collar);

        // Horizontal Lever Arm Shaft with precision micro-ribbing
        const leverArm = new THREE.Group();
        const mainBarGeom = new THREE.CylinderGeometry(0.32, 0.3, 3.2, 48);
        const mainBar = new THREE.Mesh(mainBarGeom, material);
        mainBar.rotation.z = Math.PI / 2;
        mainBar.position.set(1.6, 0, 0.28);
        leverArm.add(mainBar);

        // Micro-ribbed tactile grip rings
        const ribCount = 28;
        const ribGeom = new THREE.TorusGeometry(0.325, 0.016, 16, 48);
        for (let i = 0; i < ribCount; i++) {
          const rib = new THREE.Mesh(ribGeom, material);
          rib.rotation.y = Math.PI / 2;
          rib.position.set(0.6 + (i * 2.2) / ribCount, 0, 0.28);
          leverArm.add(rib);
        }

        // End Cap
        const capGeom = new THREE.CylinderGeometry(0.33, 0.33, 0.15, 48);
        const cap = new THREE.Mesh(capGeom, material);
        cap.rotation.z = Math.PI / 2;
        cap.position.set(3.25, 0, 0.28);
        leverArm.add(cap);

        handleGroup.add(leverArm);

        // Initial rotation
        handleGroup.position.set(-0.6, 0, 0);
        handleGroup.rotation.set(0.2, -0.6, 0);
        scene.add(handleGroup);

        canvasContainerRef.current.replaceChildren(renderer.domElement);

        // Render loop
        const animate = () => {
          if (isDisposed) return;
          renderer.render(scene, camera);
          animId = requestAnimationFrame(animate);
        };
        animate();
      } catch (err) {
        console.warn('Scroll 3D feature initialization notice:', err);
      }
    };

    setupScene();

    return () => {
      isDisposed = true;
      if (animId) cancelAnimationFrame(animId);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, [isDesktop, reducedMotion]);

  const isBrassDominant = scrollProgress < 0.5;

  return (
    <div
      ref={containerRef}
      data-reveal-section
      className="relative w-full h-[180vh] sm:h-[220vh] bg-[#0A0A0B] text-[#F5F1E8] border-t border-b border-white/[0.08]"
    >
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Soft radial glow shifting color */}
        <div
          aria-hidden="true"
          className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
          style={{
            background: isBrassDominant
              ? 'radial-gradient(circle at 60% 50%, rgba(201, 162, 75, 0.12) 0%, transparent 60%)'
              : 'radial-gradient(circle at 60% 50%, rgba(26, 26, 29, 0.3) 0%, transparent 60%)',
          }}
        />

        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Scroll-Driven Narrative (6 cols) */}
            <div data-reveal className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-6 h-[1.5px] bg-[#C9A24B]" />
                <span className="micro-label">
                  SCROLL TO COMPARE FINISHES
                </span>
              </div>

              {/* Dynamic Headline */}
              <div className="relative min-h-[90px] sm:min-h-[110px]">
                <h2
                  className={`text-[clamp(2rem,4vw,3.5rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05] transition-opacity duration-500 absolute inset-0 ${
                    isBrassDominant ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  Satin Brass Finish. <br />
                  <span className="bg-gradient-to-r from-[#E6C77A] to-[#C9A24B] bg-clip-text text-transparent">Warm, brushed gold.</span>
                </h2>
                <h2
                  className={`text-[clamp(2rem,4vw,3.5rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05] transition-opacity duration-500 absolute inset-0 ${
                    !isBrassDominant ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  Matte Black Finish. <br />
                  <span className="text-[#A1A1A6]">Clean, contemporary dark.</span>
                </h2>
              </div>

              {/* Dynamic Body Paragraph */}
              <div className="relative min-h-[90px]">
                <p
                  className={`text-base text-[#A1A1A6] leading-relaxed transition-opacity duration-500 absolute inset-0 ${
                    isBrassDominant ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  Our signature satin brass finish features linear surface brushing with a clear protective coat that maintains its warm luster over time.
                </p>
                <p
                  className={`text-base text-[#A1A1A6] leading-relaxed transition-opacity duration-500 absolute inset-0 ${
                    !isBrassDominant ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  Our matte black finish provides a deep graphite tone with low specular reflection, designed to pair with dark oak facades and minimalist architectural doors.
                </p>
              </div>

              {/* Dual Swatch Status Tracker (Pill shaped) */}
              <div className="pt-4 flex items-center gap-3">
                <div
                  className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all ${
                    isBrassDominant
                      ? 'border-[#C9A24B] bg-[#C9A24B]/15 text-[#F5F5F7]'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#C9A24B] border border-black/20 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    Satin Brass ({Math.round((1 - scrollProgress) * 100)}%)
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border transition-all ${
                    !isBrassDominant
                      ? 'border-white/40 bg-white/10 text-[#F5F5F7]'
                      : 'border-white/10 text-white/40'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#1A1A1D] border border-white/20 shrink-0" />
                  <span className="text-xs uppercase tracking-wider font-semibold">
                    Matte Black ({Math.round(scrollProgress * 100)}%)
                  </span>
                </div>
              </div>

              {/* Scroll progress cue */}
              <div className="pt-2 flex items-center gap-3 text-xs text-[#7D786C] font-mono">
                <div className="w-32 h-1 bg-white/15 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C9A24B] to-[#E6C77A] transition-all duration-75"
                    style={{ width: `${scrollProgress * 100}%` }}
                  />
                </div>
                <span>Scroll down to transition ({Math.round(scrollProgress * 100)}%)</span>
              </div>
            </div>

            {/* Right Column: 3D Canvas / Responsive Visualizer */}
            <div data-reveal className="lg:col-span-6 flex items-center justify-center relative min-h-[360px] sm:min-h-[460px]">
              {isDesktop && !reducedMotion ? (
                <div
                  ref={canvasContainerRef}
                  className="w-full h-[460px] sm:h-[520px] flex items-center justify-center relative select-none cursor-grab active:cursor-grabbing"
                  data-cursor="view"
                />
              ) : (
                <div className="w-full max-w-md bg-[#121214] border border-white/[0.08] rounded-sm p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div
                    className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center relative transition-all duration-500 shadow-xl"
                    style={{
                      backgroundColor:
                        activeMobileFinish === 'brass' ? 'rgba(201, 162, 75, 0.15)' : 'rgba(26, 26, 29, 0.45)',
                    }}
                  >
                    <svg
                      viewBox="0 0 160 160"
                      className="w-36 h-36 transition-colors duration-500"
                      style={{
                        color: activeMobileFinish === 'brass' ? '#C9A24B' : '#B8B2A3',
                      }}
                    >
                      <circle cx="50" cy="80" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
                      <circle cx="50" cy="80" r="16" fill="currentColor" fillOpacity="0.25" />
                      <rect x="50" y="70" width="80" height="20" rx="10" fill="currentColor" />
                      <line x1="70" y1="72" x2="70" y2="88" stroke="#0A0A0B" strokeWidth="2" />
                      <line x1="85" y1="72" x2="85" y2="88" stroke="#0A0A0B" strokeWidth="2" />
                      <line x1="100" y1="72" x2="100" y2="88" stroke="#0A0A0B" strokeWidth="2" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-heading text-xl text-[#F5F1E8]">
                      {activeMobileFinish === 'brass' ? 'Satin Brass' : 'Matte Black'}
                    </h3>
                    <p className="text-xs text-[#B8B2A3] font-body mt-1">
                      {activeMobileFinish === 'brass'
                        ? 'Directional brushed warm gold with clear seal'
                        : 'Low-luster deep black finish for modern doors'}
                    </p>
                  </div>

                  {/* Finish Toggle Buttons for Mobile Touch (Pill shaped, min 44px) */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveMobileFinish('brass')}
                      className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeMobileFinish === 'brass'
                          ? 'btn-gold-primary text-[#000000] shadow-md'
                          : 'bg-white/5 text-[#F5F5F7] border border-white/10'
                      }`}
                    >
                      Satin Brass
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveMobileFinish('black')}
                      className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        activeMobileFinish === 'black'
                          ? 'bg-[#1A1A1D] text-[#F5F5F7] border border-[#C9A24B]'
                          : 'bg-white/5 text-[#F5F5F7] border border-white/10'
                      }`}
                    >
                      Matte Black
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
