"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { cx } from "@/lib/cx";

/**
 * WebGL ASCII renderer — a dependency-free port of the reference's postprocessing ASCIIEffect.
 * The image is drawn as a grid of glyphs picked by luminance, tinted from --ascii-color-dark
 * to --ascii-color. `reveal(delay)` plays the two-stage typewriter: glyphs appear radially from
 * `revealOrigin` (3.5s power3.out), then the colour sweep follows 0.15s later.
 * Hover: a gooey blob around the cursor scrambles glyphs and shows the original pixels;
 * the image shifts with a depth map (desktop only).
 */

const CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const REVEAL_DURATION = 3.5;
const COLOR_DELAY = 0.15;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform vec2 resolution;
uniform sampler2D uImage;
uniform vec4 uImageRect;
uniform sampler2D uCharacters;
uniform float uCharactersCount;
uniform float uCellSize;
uniform vec3 uColor;
uniform vec3 uColorDark;
uniform float uProgress;
uniform float uColorProgress;
uniform float uRandomness;
uniform bool uEnableGooeyReveal;
uniform vec2 uMouse;
uniform float uGooeyRadius;
uniform float uGooeySoftness;
uniform float uGooeyNoiseIntensity;
uniform float uGooeyIntensity;
uniform float uScrambleSeed;
uniform float uTime;
uniform sampler2D uDepthMap;
uniform bool uEnableDepthParallax;
uniform float uParallaxIntensity;
uniform vec2 uParallaxOffset;
uniform vec2 uRevealOrigin;

const vec2 SIZE = vec2(16.);
const float ALPHA_THRESHOLD = 0.1;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec4 scene(vec2 uv) {
  vec2 iuv = (uv - uImageRect.xy) / uImageRect.zw;
  if (iuv.x < 0.0 || iuv.y < 0.0 || iuv.x > 1.0 || iuv.y > 1.0) return vec4(0.0);
  return texture2D(uImage, iuv);
}
float depthAt(vec2 uv) {
  vec2 iuv = clamp((uv - uImageRect.xy) / uImageRect.zw, 0.0, 1.0);
  return texture2D(uDepthMap, iuv).r;
}
float getLuminance(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

void main() {
  vec2 uv = vUv;
  vec2 distortedUV = uv;
  float depth = 0.5;
  if (uEnableDepthParallax) {
    depth = depthAt(uv);
    distortedUV = uv + uParallaxOffset * depth * uParallaxIntensity;
  }

  vec2 cell = resolution / uCellSize;
  vec2 grid = 1.0 / cell;
  vec2 pixelizedUV = grid * (0.5 + floor(distortedUV / grid));
  vec4 pixelized = scene(pixelizedUV);
  vec4 original = scene(distortedUV);

  if (pixelized.a < ALPHA_THRESHOLD) { gl_FragColor = vec4(0.0); return; }

  vec2 cellCoord = floor(uv / grid);

  float gooeyBlend = 0.0;
  if (uEnableGooeyReveal && uGooeyIntensity > 0.01 && uMouse.x > -0.5) {
    vec2 aspect = vec2(resolution.x / resolution.y, 1.0);
    float dist = distance(pixelizedUV * aspect, uMouse * aspect);
    float gooeyRandom = hash(cellCoord) * uGooeyNoiseIntensity * 2.0;
    float timeOffset = sin(uTime * 1.5 + hash(cellCoord * 1.7) * 6.28) * uGooeyNoiseIntensity * 0.3;
    float d = dist + gooeyRandom + timeOffset;
    float radius = uGooeyRadius * uGooeyIntensity;
    float softness = uGooeySoftness * uGooeyIntensity * 0.5;
    gooeyBlend = 1.0 - smoothstep(radius - softness, radius + softness, d);
  }

  float luminance = getLuminance(pixelized.rgb);
  luminance = smoothstep(0.0, 1.0, luminance);
  luminance = pow(luminance, 1.3);

  float characterIndex = floor((uCharactersCount - 1.0) * clamp(luminance, 0.0, 1.0));
  if (gooeyBlend > 0.0) {
    float scramble = hash(cellCoord + uScrambleSeed);
    characterIndex = floor(mod(characterIndex + scramble * uCharactersCount * luminance, uCharactersCount));
  }

  vec2 characterPosition = vec2(mod(characterIndex, SIZE.x), floor(characterIndex / SIZE.y));
  vec2 offset = vec2(characterPosition.x, -characterPosition.y) / SIZE;
  vec2 charUV = mod(distortedUV * (cell / SIZE), 1.0 / SIZE) - vec2(0.0, 1.0 / SIZE) + offset;
  float finalAlpha = texture2D(uCharacters, charUV).r;
  finalAlpha *= smoothstep(ALPHA_THRESHOLD, ALPHA_THRESHOLD + 0.2, pixelized.a);

  // Two-stage typewriter reveal radiating from uRevealOrigin
  vec2 originCell = uRevealOrigin * cell;
  float revealDist = length(cellCoord - originCell);
  float maxDist = max(max(length(-originCell), length(vec2(cell.x, 0.0) - originCell)),
                      max(length(vec2(0.0, cell.y) - originCell), length(cell - originCell)));
  float threshold = revealDist / max(maxDist, 1.0) + hash(cellCoord) * uRandomness * 0.15 + 0.06;
  float revealScale = 1.0 + uRandomness * 0.3 + 0.1;
  float scaled = uProgress * revealScale;
  float visibility = 1.0 - smoothstep(scaled - 0.05, scaled + 0.05, threshold);
  float visRipple = exp(-(threshold - scaled) * (threshold - scaled) * 180.0);

  float scaledColor = uColorProgress * revealScale;
  float colorBlend = 1.0 - smoothstep(scaledColor - 0.05, scaledColor + 0.05, threshold);
  float ripple = exp(-(threshold - scaledColor) * (threshold - scaledColor) * 180.0) + visRipple;

  finalAlpha *= visibility;
  vec3 targetColor = mix(uColorDark, uColor, luminance);
  vec3 finalColor = mix(pixelized.rgb, targetColor, colorBlend);
  if (ripple > 0.01) finalColor += ripple * 0.35;

  if (gooeyBlend > 0.0) {
    float sharp = smoothstep(0.0, 0.15, gooeyBlend);
    vec3 gooeyTarget = mix(targetColor, original.rgb, colorBlend);
    gl_FragColor = vec4(mix(finalColor, gooeyTarget, sharp) * finalAlpha, finalAlpha);
    return;
  }
  gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
}
`;

export type AsciiImageHandle = { reveal: (delay?: number) => void; showInstantly: () => void };

type Props = {
  src: string;
  mobileSrc?: string;
  depthSrc?: string | null;
  cellSize?: number;
  parallaxIntensity?: number;
  revealOrigin?: { x: number; y: number };
  alignX?: "left" | "center" | "right";
  alignY?: "top" | "center" | "bottom";
  fit?: "contain" | "cover";
  randomness?: number;
  className?: string;
  alt?: string;
};

function cssColor(varName: string, fallback: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = `var(${varName}, ${fallback})`;
  probe.style.display = "none";
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255];
  probe.remove();
  // color-mix() may resolve to color(srgb r g b) in 0–1 floats
  const scale = rgb.slice(0, 3).every((v) => v <= 1) ? 1 : 255;
  return [rgb[0] / scale, rgb[1] / scale, rgb[2] / scale];
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function makeAtlas() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 1024, 1024);
  ctx.font = `54px "Cascadia Mono", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  for (let i = 0; i < CHARS.length; i++) ctx.fillText(CHARS[i], 64 * (i % 16) + 32, 64 * Math.floor(i / 16) + 32);
  return canvas;
}

export const AsciiImage = forwardRef<AsciiImageHandle, Props>(function AsciiImage(
  {
    src,
    mobileSrc,
    depthSrc,
    cellSize = 14,
    parallaxIntensity = 0.12,
    revealOrigin = { x: 0.5, y: 0.5 },
    alignX = "center",
    alignY = "bottom",
    fit = "contain",
    randomness = 0.6,
    className,
    alt = "",
  },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ progress: 0, colorProgress: 0 });
  const pending = useRef<number | null>(null);
  const started = useRef(false);
  const invalidate = useRef<() => void>(() => {});
  const [fallback, setFallback] = useState(false);

  useImperativeHandle(ref, () => ({
    reveal: (delay = 0) => {
      if (started.current) return;
      started.current = true;
      pending.current = delay;
      gsap.to(state.current, { progress: 1, duration: REVEAL_DURATION, delay, ease: "power3.out", onUpdate: () => invalidate.current() });
      gsap.to(state.current, {
        colorProgress: 1,
        duration: REVEAL_DURATION,
        delay: delay + COLOR_DELAY,
        ease: "power3.out",
        onUpdate: () => invalidate.current(),
      });
    },
    showInstantly: () => {
      started.current = true;
      state.current.progress = 1;
      state.current.colorProgress = 1;
      invalidate.current();
    },
  }));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setFallback(true);
    const canvas = canvasRef.current;
    const container = wrap.current;
    if (!canvas || !container) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    if (!gl) return setFallback(true);

    const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    let disposed = false;

    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader error");
      return s;
    };
    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link error");
    } catch (e) {
      console.warn("[AsciiImage]", e);
      setFallback(true);
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const texture = (unit: number, source: TexImageSource, repeat: boolean, nearest: boolean) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      const wrapMode = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
      const filter = nearest ? gl.NEAREST : gl.LINEAR;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      return t;
    };

    const color = cssColor("--ascii-color", "#ff6b4a");
    const colorDark = cssColor("--ascii-color-dark", "#1a0a2e");
    gl.uniform3fv(u("uColor"), color);
    gl.uniform3fv(u("uColorDark"), colorDark);
    gl.uniform1f(u("uCharactersCount"), CHARS.length);
    gl.uniform1f(u("uRandomness"), randomness);
    gl.uniform2f(u("uRevealOrigin"), revealOrigin.x, revealOrigin.y);
    gl.uniform1i(u("uEnableGooeyReveal"), touch ? 0 : 1);
    gl.uniform1f(u("uGooeyRadius"), 0.035);
    gl.uniform1f(u("uGooeySoftness"), 0.04);
    gl.uniform1f(u("uGooeyNoiseIntensity"), 0.02);
    gl.uniform1f(u("uParallaxIntensity"), parallaxIntensity);
    gl.uniform1i(u("uEnableDepthParallax"), 0);
    gl.uniform1i(u("uImage"), 0);
    gl.uniform1i(u("uCharacters"), 1);
    gl.uniform1i(u("uDepthMap"), 2);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let image: HTMLImageElement | null = null;
    let visible = true;
    let raf = 0;
    let dirty = true;
    const mouse = { x: 0, y: 0, hovering: false, wasHovering: false };
    const parallax = { x: 0, y: 0 };
    let gooey = 0;
    let seed = 0;

    const atlas = makeAtlas();
    texture(1, atlas, true, true);
    document.fonts?.ready.then(() => {
      if (disposed) return;
      const fresh = makeAtlas();
      texture(1, fresh, true, true);
      dirty = true;
    });

    const layout = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u("resolution"), canvas.width, canvas.height);
      // Reference cell sizing: scales with the container and pixel ratio.
      gl.uniform1f(u("uCellSize"), cellSize * Math.max(0.5, Math.max(w, h) / 1920) * 1.35 * (dpr / 2));
      if (image) {
        const iw = image.naturalWidth;
        const ih = image.naturalHeight;
        const scale = fit === "contain" ? Math.min(w / iw, h / ih) : Math.max(w / iw, h / ih);
        const dw = (iw * scale) / w;
        const dh = (ih * scale) / h;
        const x = alignX === "left" ? 0 : alignX === "right" ? 1 - dw : (1 - dw) / 2;
        const y = alignY === "bottom" ? 0 : alignY === "top" ? 1 - dh : (1 - dh) / 2; // GL y is up
        gl.uniform4f(u("uImageRect"), x, y, dw, dh);
      }
      dirty = true;
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible || !image) return;
      const { progress, colorProgress } = state.current;
      // Ease the hover-driven values toward their targets (reference lerps 0.08 in / 0.06 out).
      const target = mouse.hovering ? 1 : 0;
      gooey += (target - gooey) * (mouse.hovering ? 0.08 : 0.06);
      const px = mouse.hovering ? -mouse.x * 0.5 : 0;
      const py = mouse.hovering ? -mouse.y * 0.25 : 0;
      const k = mouse.hovering ? 0.08 : 0.05;
      parallax.x += (px - parallax.x) * k;
      parallax.y += (py - parallax.y) * k;
      if (mouse.hovering && !mouse.wasHovering) seed += 1;
      mouse.wasHovering = mouse.hovering;

      const animating =
        dirty || gooey > 0.001 || Math.abs(px - parallax.x) > 1e-4 || Math.abs(py - parallax.y) > 1e-4 || (progress > 0 && colorProgress < 1);
      if (!animating) return;
      dirty = false;
      gl.uniform1f(u("uProgress"), progress);
      gl.uniform1f(u("uColorProgress"), colorProgress);
      gl.uniform1f(u("uTime"), time / 1000);
      gl.uniform1f(u("uGooeyIntensity"), gooey);
      gl.uniform1f(u("uScrambleSeed"), seed);
      gl.uniform2f(u("uMouse"), (mouse.x + 1) / 2, (mouse.y + 1) / 2);
      gl.uniform2f(u("uParallaxOffset"), parallax.x, parallax.y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    invalidate.current = () => {
      dirty = true;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = container.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      mouse.hovering = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };
    const onLeave = () => {
      mouse.hovering = false;
    };

    const ro = new ResizeObserver(layout);
    ro.observe(container);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) dirty = true;
    });
    io.observe(container);
    if (!touch) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }

    const narrow = window.matchMedia("(max-width: 1023px)").matches;
    loadImage(touch && mobileSrc ? mobileSrc : narrow && mobileSrc ? mobileSrc : src)
      .then((img) => {
        if (disposed) return;
        image = img;
        texture(0, img, false, false);
        layout();
      })
      .catch(() => !disposed && setFallback(true));
    if (depthSrc && !touch) {
      loadImage(depthSrc)
        .then((img) => {
          if (disposed) return;
          texture(2, img, false, false);
          gl.uniform1i(u("uEnableDepthParallax"), 1);
          dirty = true;
        })
        .catch(() => {});
    }
    raf = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      // Don't force-lose the context: React StrictMode remounts reuse this canvas.
      gl.deleteProgram(program);
      gl.deleteBuffer(buf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, mobileSrc, depthSrc]);

  return (
    <div ref={wrap} className={cx("absolute inset-0", className)}>
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mobileSrc ?? src}
          alt={alt}
          className={cx(
            "absolute inset-0 h-full w-full animate-fade-in",
            fit === "contain" ? "object-contain" : "object-cover",
            alignY === "bottom" ? "object-bottom" : "",
          )}
        />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label={alt || undefined} role={alt ? "img" : undefined} />
      )}
    </div>
  );
});
