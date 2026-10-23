"use client";

import React, { useEffect, useRef, useMemo, useState, Component } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { Truck, Warehouse, Sparkles, Navigation, ArrowDown, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "./AnimatedButton";

const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 centeredUv = vUv - uCenter;
    float aspect = uResolution.x / uResolution.y;
    centeredUv.x *= aspect;
    float dist = length(centeredUv);
    
    float angle = atan(centeredUv.y, centeredUv.x);
    
    float noiseScale = 6.0;
    vec2 pixelatedUv = floor(vUv * uResolution / noiseScale) * noiseScale / uResolution;
    float blockNoise = fbm(pixelatedUv * 100.0) * 0.15;
    
    float angularNoise = fbm(vec2(angle * 5.0, 0.0)) * 0.15;
    
    float totalNoise = blockNoise + angularNoise;
    float noisyDist = dist + totalNoise;
    
    float maxDist = length(vec2(aspect * 0.5, 0.5));
    float normalizedDist = noisyDist / maxDist;
    
    float dissolveThreshold = uDissolve * 1.5; 
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor;
    
    float edgeGlowIntensity = uEdgeIntensity * 2.0;
    float edgeGlow = edge * edgeGlowIntensity * (1.0 + uGrayscale * 3.0);
    finalColor += edgeColor * edgeGlow * uEdgeBrightness;
    
    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist) * 
                     smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;
    
    float edgeBrightness = (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0);
    finalColor += vec3(sparkle * 3.0 * edgeBrightness);
    
    float alpha = dissolveMask * texColor.a;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const coverFragmentShaderReverse = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 darkBase = vec3(0.0);
    vec3 baseColor = mix(texColor.rgb, darkBase, uDarkness);
    
    float edgeGlow = edge * uEdgeIntensity * 2.0;
    baseColor += edgeColor * edgeGlow;
    
    vec3 finalColor = clamp(baseColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

interface SceneProps {
  imageFront: string;
  imageBack: string;
  scrollYProgress: any;
}

const Scene = ({ imageFront, imageBack, scrollYProgress }: SceneProps) => {
  const [texture1, texture2] = useTexture([imageFront, imageBack]);
  const material1Ref = useRef<THREE.ShaderMaterial>(null);
  const material2Ref = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const invalidate = useThree((state) => state.invalidate);
  const invalidateRef = useRef(invalidate);
  invalidateRef.current = invalidate;

  useEffect(() => {
    const unsub = scrollYProgress.on("change", () => {
      invalidateRef.current?.();
    });
    return () => {
      unsub();
    };
  }, [scrollYProgress]);

  const uniforms1 = useMemo(() => {
    const img1 = texture1?.image as HTMLImageElement | undefined;
    const w = img1?.naturalWidth || img1?.width || 1920;
    const h = img1?.naturalHeight || img1?.height || 1080;
    return {
      uTexture: { value: texture1 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(w, h) },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uGrayscale: { value: 0.0 },
      uEdgeIntensity: { value: 0.0 },
      uEdgeBrightness: { value: 1.0 },
    };
  }, [texture1, size]);

  const uniforms2 = useMemo(() => {
    const img2 = texture2?.image as HTMLImageElement | undefined;
    const w = img2?.naturalWidth || img2?.width || 1920;
    const h = img2?.naturalHeight || img2?.height || 1080;
    return {
      uTexture: { value: texture2 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uImageResolution: { value: new THREE.Vector2(w, h) },
      uDissolve: { value: 0.0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0.0 },
      uBrightness: { value: 0.0 },
      uEdgeIntensity: { value: 0.6 },
      uDarkness: { value: 1.0 },
      uGrayscale: { value: 1.0 },
    };
  }, [texture2, size]);

  useFrame((state) => {
    const timeInSeconds = state.clock.getElapsedTime();
    const progress = scrollYProgress.get();

    if (material1Ref.current) {
      material1Ref.current.uniforms.uTime.value = timeInSeconds;
      material1Ref.current.uniforms.uResolution.value.set(
        size.width,
        size.height
      );

      material1Ref.current.uniforms.uDissolve.value = progress;
      const grayscaleProgress = Math.min(1.0, progress / 0.4);
      material1Ref.current.uniforms.uGrayscale.value = grayscaleProgress;
      material1Ref.current.uniforms.uEdgeIntensity.value = progress * 0.5;
      material1Ref.current.uniforms.uEdgeBrightness.value = 1.0 - progress;
    }

    if (material2Ref.current) {
      material2Ref.current.uniforms.uTime.value = timeInSeconds;
      material2Ref.current.uniforms.uResolution.value.set(
        size.width,
        size.height
      );

      const acceleratedProgress = Math.min(1.0, progress * 1.1);
      material2Ref.current.uniforms.uEdgeIntensity.value =
        0.6 * (1.0 - acceleratedProgress);
      material2Ref.current.uniforms.uDarkness.value =
        1.0 - acceleratedProgress;
      material2Ref.current.uniforms.uGrayscale.value =
        1.0 - acceleratedProgress;
    }
  });

  return (
    <>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material2Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShaderReverse}
          uniforms={uniforms2}
          transparent={true}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={material1Ref}
          vertexShader={coverVertexShader}
          fragmentShader={coverFragmentShader}
          uniforms={uniforms1}
          transparent={true}
        />
      </mesh>
    </>
  );
};

// Safe WebGL error boundary to prevent UI crashes in virtual/headless or unaccelerated environments
class WebGLErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.warn("WebGL Shader error captured gracefully:", error);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export interface ScrollDissolveRevealProps {
  imageFront: string;
  imageBack: string;
  className?: string;
  containerClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  frontLabel?: string;
  frontTitle?: string;
  frontDescription?: string;
  backLabel?: string;
  backTitle?: string;
  backDescription?: string;
  onOpenBooking?: () => void;
}

export function ScrollDissolveReveal({
  imageFront,
  imageBack,
  className,
  containerClassName,
  scrollContainerRef,
  frontLabel = "01 • FLEET IN TRANSIT",
  frontTitle = "Swift Intra-City Fleet Dispatch Across Lucknow",
  frontDescription = "Real-time coordinated transport vehicles connecting Gomti Nagar, Transport Nagar, Hazratganj, and industrial logistics corridors.",
  backLabel = "02 • CENTRALIZED LOGISTICS HUB",
  backTitle = "Intelligent Cargo Sorting & Door-to-Door Delivery",
  backDescription = "Over 1,200+ verified commercial consignments handled with 99.4% on-time dispatch and zero unexpected cash bargaining.",
  onOpenBooking,
}: ScrollDissolveRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progressValue, setProgressValue] = useState(0);

  const scrollOptions = useMemo(
    () => ({
      target: containerRef,
      offset: ["start start", "end end"] as ["start start", "end end"],
      ...(scrollContainerRef ? { container: scrollContainerRef } : {}),
    }),
    [scrollContainerRef]
  );

  const { scrollYProgress } = useScroll(scrollOptions);

  const lastProgressRef = useRef<number>(-1);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest: number) => {
      const rounded = Math.round(latest * 100) / 100;
      if (Math.abs(rounded - lastProgressRef.current) >= 0.01) {
        lastProgressRef.current = rounded;
        setProgressValue(rounded);
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  const percentage = Math.min(100, Math.max(0, Math.round(progressValue * 100)));

  // Fallback CSS Dissolve if WebGL fails or unaccelerated
  const fallbackView = (
    <div className="relative w-full h-full bg-zinc-950 overflow-hidden">
      <img
        src={imageBack}
        alt="PATGOLITO Central Logistics Hub"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 w-full h-full transition-opacity duration-300"
        style={{ opacity: Math.max(0, 1 - progressValue * 1.4) }}
      >
        <img
          src={imageFront}
          alt="PATGOLITO Commercial Fleet in Transit"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[280vh] w-full bg-black select-none", containerClassName)}
    >
      <div className={cn("sticky top-0 h-screen w-full overflow-hidden bg-black", className)}>
        {/* WebGL 3D Shader Canvas */}
        <div className="absolute inset-0 w-full h-full">
          <WebGLErrorBoundary fallback={fallbackView}>
            <Canvas
              dpr={1}
              frameloop="demand"
              gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
            >
              <OrthographicCamera
                makeDefault
                manual
                left={-1}
                right={1}
                top={1}
                bottom={-1}
                near={0.1}
                far={10}
                position={[0, 0, 1]}
              />
              <React.Suspense fallback={null}>
                <Scene
                  imageFront={imageFront}
                  imageBack={imageBack}
                  scrollYProgress={scrollYProgress}
                />
              </React.Suspense>
            </Canvas>
          </WebGLErrorBoundary>
        </div>

        {/* Ambient Dark Gradient Overlays for High-Contrast Readability (Zero Blue) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/70" />

        {/* ======================================================== */}
        {/* DESKTOP INTERACTIVE HUD OVERLAY */}
        {/* ======================================================== */}
        <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10 md:p-14 text-white pointer-events-none">
          {/* Top Bar: Brand Identifier & Desktop Live Status */}
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs font-bold text-zinc-200 shadow-xl pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="tracking-wider uppercase text-[11px] text-zinc-300">
                PATGOLITO Visual Experience
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                {percentage < 45 ? "FLEET IN TRANSIT" : percentage < 75 ? "PIXEL DISSOLVE" : "CENTRAL HUB"}
              </span>
            </div>

            {/* Stage Progress Pill */}
            <div className="hidden sm:inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-zinc-800 text-xs font-mono text-zinc-400 pointer-events-auto">
              <span className={cn("transition-colors", percentage < 45 ? "text-emerald-400 font-bold" : "text-zinc-500")}>
                01 Transit
              </span>
              <span className="text-zinc-700">→</span>
              <span className={cn("transition-colors", percentage >= 45 && percentage < 75 ? "text-emerald-400 font-bold" : "text-zinc-500")}>
                02 Shader Reveal
              </span>
              <span className="text-zinc-700">→</span>
              <span className={cn("transition-colors", percentage >= 75 ? "text-emerald-400 font-bold" : "text-zinc-500")}>
                03 Central Hub
              </span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-300 text-[10px] font-bold">
                {percentage}%
              </span>
            </div>
          </div>

          {/* Bottom Narrative HUD Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="wait">
                {progressValue < 0.5 ? (
                  <motion.div
                    key="front-hud"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="p-6 sm:p-8 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/90 shadow-2xl space-y-3 pointer-events-auto max-w-2xl"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{frontLabel}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {frontTitle}
                    </h3>

                    <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                      {frontDescription}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <ShieldCheck className="w-4 h-4" /> 20-40 Min Dispatch
                      </span>
                      <span>•</span>
                      <span>Upfront Transparent Km Rate</span>
                      <span>•</span>
                      <span>Zero Cash Haggling</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back-hud"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="p-6 sm:p-8 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-emerald-500/30 shadow-2xl space-y-3 pointer-events-auto max-w-2xl"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                      <Warehouse className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{backLabel}</span>
                    </div>

                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                      {backTitle}
                    </h3>

                    <p className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
                      {backDescription}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <Sparkles className="w-4 h-4" /> 99.4% On-Time Arrival
                      </span>
                      <span>•</span>
                      <span>Intra-City & Intercity UP</span>
                      <span>•</span>
                      <span>Commercial GST Invoices</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action & Scroll Prompt (Desktop Optimized) */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-3 pointer-events-auto">
              {onOpenBooking && (
                <AnimatedButton
                  onClick={onOpenBooking}
                  className="bg-white text-black hover:bg-zinc-200 font-extrabold text-sm px-6 py-3.5 rounded-xl border border-zinc-200 shadow-xl"
                  shineColor="rgba(0,0,0,0.35)"
                >
                  <Navigation className="w-4 h-4 text-black mr-1" />
                  <span>Book Commercial Vehicle</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </AnimatedButton>
              )}

              <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 bg-zinc-950/80 px-3.5 py-1.5 rounded-full border border-zinc-800">
                <ArrowDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>Scroll to dissolve and reveal hub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
