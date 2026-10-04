// GLSL for the space scene. Planet surfaces and the nebula are expensive noise, so they are baked once into
// equirectangular textures (see bake.js); per-frame shaders only sample those and do the lighting.

export const noise = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  const mat3 ROT = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);
  float fbm(vec3 p, int oct) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 10; i++) {
      if (i >= oct) break;
      v += a * noise(p);
      p = ROT * p * 2.03;
      a *= 0.5;
    }
    return v;
  }
  float ridged(vec3 p, int oct) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 10; i++) {
      if (i >= oct) break;
      float n = 1.0 - abs(noise(p) * 2.0 - 1.0);
      v += a * n * n;
      p = ROT * p * 2.1;
      a *= 0.5;
    }
    return v;
  }
  // Distance to the nearest jittered cell point: craters and city clusters.
  vec2 cells(vec3 p) {
    vec3 i = floor(p);
    float best = 9.0, id = 0.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
    for (int z = -1; z <= 1; z++) {
      vec3 c = i + vec3(x, y, z);
      vec3 o = vec3(hash(c), hash(c + 7.1), hash(c + 13.7));
      float d = length(c + o - p);
      if (d < best) { best = d; id = hash(c + 3.3); }
    }
    return vec2(best, id);
  }
`;

// Maps a texel to the same direction three's SphereGeometry gives that uv, so textures wrap without a seam.
export const bakeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;
const dirFromUv = /* glsl */ `
  vec3 dirFromUv(vec2 uv) {
    float phi = uv.x * 6.2831853;
    float theta = (1.0 - uv.y) * 3.1415927;
    return vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
  }
`;
const bake = (body) => /* glsl */ `
  uniform float uPass;
  varying vec2 vUv;
  ${noise}
  ${dirFromUv}
  void main() {
    vec3 d = dirFromUv(vUv);
    ${body}
  }
`;

/* ---------- Surfaces. Pass 0: rgb albedo + height. Pass 1: clouds, ocean mask, night lights. ---------- */

export const BAKES = {
  earth: bake(`
    vec3 q = vec3(fbm(d * 1.6 + 3.1, 5), fbm(d * 1.6 + 8.7, 5), fbm(d * 1.6 + 1.9, 5));
    float h = fbm(d * 2.2 + q * 1.6, 8) * 0.75 + ridged(d * 3.0 + q, 6) * 0.35;
    float sea = 0.56;
    float land = smoothstep(sea, sea + 0.012, h);
    float lat = abs(d.y);
    float coast = 1.0 - smoothstep(0.0, 0.05, abs(h - sea));

    if (uPass < 0.5) {
      float depth = clamp((sea - h) / 0.3, 0.0, 1.0);
      vec3 ocean = mix(vec3(0.006, 0.035, 0.075), vec3(0.001, 0.007, 0.025), pow(depth, 0.5));
      ocean = mix(ocean, vec3(0.012, 0.08, 0.1), coast * (1.0 - land) * 0.7);
      float e = clamp((h - sea) / 0.32, 0.0, 1.0);
      float moist = fbm(d * 4.0 + 20.0, 5);
      float desertBelt = exp(-pow((lat - 0.42) * 5.5, 2.0));
      vec3 green = mix(vec3(0.018, 0.04, 0.012), vec3(0.045, 0.065, 0.022), moist);
      vec3 desert = mix(vec3(0.16, 0.1, 0.05), vec3(0.3, 0.2, 0.1), fbm(d * 9.0 + q * 2.0, 5));
      vec3 ground = mix(green, desert, smoothstep(0.35, 0.65, desertBelt * 0.9 + (0.5 - moist) * 1.2));
      ground = mix(ground, vec3(0.09, 0.075, 0.06), smoothstep(0.3, 0.7, e));
      ground *= 0.75 + 0.5 * fbm(d * 40.0 + q, 5);
      ground = mix(ground, vec3(0.6, 0.62, 0.66), smoothstep(0.78, 0.95, e));
      vec3 col = mix(ocean, ground, land);
      float ice = smoothstep(0.86, 0.92, lat + fbm(d * 6.0, 4) * 0.1);
      col = mix(col, vec3(0.65, 0.7, 0.75), ice);
      gl_FragColor = vec4(col, land * (0.15 + e * 0.85));
    } else {
      vec3 w = vec3(fbm(d * 3.0 + 40.0, 4), fbm(d * 3.0 + 50.0, 4), fbm(d * 3.0 + 60.0, 4));
      float swirl = fbm(d * 3.2 + w * 2.6, 8);
      float bands = 0.75 + 0.25 * cos(d.y * 11.0);
      float clouds = smoothstep(0.44, 0.72, swirl * bands + (fbm(d * 24.0, 4) - 0.5) * 0.14);
      float ice = smoothstep(0.86, 0.92, lat);
      vec2 c = cells(d * 70.0);
      float town = smoothstep(0.35, 0.0, c.x) * step(0.55, c.y);
      float lights = land * (1.0 - ice) * town * smoothstep(0.45, 0.75, fbm(d * 7.0 + 5.0, 4) + coast * 0.25);
      gl_FragColor = vec4(clouds, 1.0 - land, lights, 1.0);
    }
  `),

  // Ice giant: deep azure bands, bright methane streaks, one dark storm.
  ice: bake(`
    vec3 w = vec3(fbm(d * 2.0, 4), fbm(d * 2.0 + 9.0, 4), 0.0);
    float y = d.y + (w.x - 0.5) * 0.08;
    float bands = fbm(vec3(y * 9.0, w.y * 0.6, 0.0), 5);
    vec3 col = mix(vec3(0.012, 0.04, 0.16), vec3(0.04, 0.12, 0.36), bands);
    col = mix(col, vec3(0.25, 0.45, 0.7), smoothstep(0.66, 0.85, fbm(vec3(y * 22.0, d.x * 1.5 + w.x * 2.0, d.z * 1.5), 5)) * 0.35);
    col *= 0.82 + 0.18 * smoothstep(1.0, 0.2, abs(d.y));
    vec3 spot = normalize(vec3(0.6, -0.35, 0.72));
    float s = smoothstep(0.985, 0.995, dot(d, spot) + (fbm(d * 30.0, 3) - 0.5) * 0.006);
    col = mix(col, vec3(0.004, 0.012, 0.06), s * 0.85);
    gl_FragColor = vec4(col, uPass < 0.5 ? 0.0 : 1.0);
    if (uPass > 0.5) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  `),

  // Ringed gas giant: soft cream and butterscotch belts with turbulent edges.
  gas: bake(`
    vec3 w = vec3(fbm(d * 3.0, 5), fbm(d * 3.0 + 4.0, 5), 0.0);
    float y = d.y + (w.x - 0.5) * 0.02 + (fbm(d * vec3(2.0, 12.0, 2.0) + w * 1.5, 5) - 0.5) * 0.015;
    float b = fbm(vec3(y * 16.0, 0.5, 0.5), 6);
    vec3 col = mix(vec3(0.24, 0.15, 0.07), vec3(0.52, 0.42, 0.27), smoothstep(0.3, 0.7, b));
    col = mix(col, vec3(0.2, 0.11, 0.05), smoothstep(0.62, 0.8, fbm(vec3(y * 40.0, 1.0, 1.0), 4)) * 0.5);
    col = mix(col, vec3(0.2, 0.24, 0.26), smoothstep(0.82, 0.95, abs(d.y)) * 0.6);
    gl_FragColor = uPass < 0.5 ? vec4(col, 0.0) : vec4(0.0, 0.0, 0.0, 1.0);
  `),

  // Desert world: rust plains, dark basalt, cratered highlands, polar cap.
  mars: bake(`
    vec3 q = vec3(fbm(d * 2.0 + 1.0, 5), fbm(d * 2.0 + 6.0, 5), 0.0);
    float h = fbm(d * 2.4 + q, 8);
    float crater = 0.0;
    for (int i = 0; i < 3; i++) {
      float sc = 6.0 * pow(2.6, float(i));
      vec2 c = cells(d * sc + float(i) * 11.0);
      float r = 0.18 + c.y * 0.22;
      float bowl = smoothstep(r, r * 0.55, c.x);
      float rim = smoothstep(r * 0.7, r, c.x) * smoothstep(r * 1.35, r, c.x);
      crater += (rim * 0.5 - bowl * 0.6) * step(0.72 - float(i) * 0.12, c.y) / float(i + 1);
    }
    float height = clamp(h + crater * 0.25, 0.0, 1.0);
    vec3 col = mix(vec3(0.1, 0.03, 0.012), vec3(0.34, 0.13, 0.05), smoothstep(0.35, 0.65, h));
    col = mix(col, vec3(0.05, 0.025, 0.018), smoothstep(0.55, 0.75, fbm(d * 3.5 + 30.0, 6)) * 0.7);
    col *= 0.9 + crater * 0.35;
    col = mix(col, vec3(0.6, 0.58, 0.56), smoothstep(0.9, 0.97, abs(d.y) + (fbm(d * 8.0, 5) - 0.5) * 0.1));
    gl_FragColor = uPass < 0.5 ? vec4(col, height) : vec4(0.0, 0.0, 0.0, 1.0);
  `),

  moon: bake(`
    float h = fbm(d * 3.0, 7);
    float crater = 0.0;
    for (int i = 0; i < 4; i++) {
      float sc = 4.0 * pow(2.4, float(i));
      vec2 c = cells(d * sc + float(i) * 17.0);
      float r = 0.15 + c.y * 0.25;
      crater += (smoothstep(r * 0.7, r, c.x) * smoothstep(r * 1.3, r, c.x) * 0.6 - smoothstep(r, r * 0.4, c.x) * 0.5) * step(0.35, c.y) / float(i + 1);
    }
    float maria = smoothstep(0.5, 0.62, fbm(d * 1.4 + 3.0, 5));
    vec3 col = mix(vec3(0.24, 0.23, 0.22), vec3(0.08, 0.08, 0.085), maria) * (0.85 + crater * 0.4 + h * 0.2);
    gl_FragColor = uPass < 0.5 ? vec4(col, clamp(h * 0.5 + crater * 0.5 + 0.3, 0.0, 1.0)) : vec4(0.0, 0.0, 0.0, 1.0);
  `),

  // The sky: a galactic band of blue and violet nebulae, dark dust lanes, one warm star-forming region and
  // a dense haze of faint stars. Bright stars are drawn live so they stay pin-sharp.
  sky: bake(`
    vec3 gp = normalize(vec3(0.55, 1.0, 0.35));
    float lat = dot(d, gp) + (fbm(d * 1.5 + 2.0, 3) - 0.5) * 0.25;
    float band = exp(-lat * lat * 11.0);
    vec3 q = vec3(fbm(d * 2.0 + 1.7, 5), fbm(d * 2.0 + 9.2, 5), fbm(d * 2.0 + 4.4, 5));
    vec3 r = vec3(fbm(d * 3.0 + q * 2.0 + 3.0, 5), fbm(d * 3.0 + q * 2.0 + 7.0, 5), 0.0);
    float n = fbm(d * 2.5 + r * 2.2, 7);
    float fine = fbm(d * 9.0 + r * 3.0, 6);

    vec3 col = vec3(0.0015, 0.003, 0.012);
    float cloud = smoothstep(0.5, 0.92, n) * (0.03 + band * band * 1.2);
    col += vec3(0.012, 0.035, 0.2) * cloud * 1.5;
    col += vec3(0.05, 0.03, 0.2) * smoothstep(0.55, 0.95, n + fine * 0.3 - 0.15) * (0.02 + band * band) * 0.7;
    col += vec3(0.05, 0.22, 0.65) * pow(smoothstep(0.58, 0.98, n * 0.7 + fine * 0.45), 2.5) * (0.02 + band * band) * 1.1;

    // Warm emission region, lower right of the opening view.
    vec3 warm = normalize(vec3(0.75, -0.32, -0.58));
    float wm = smoothstep(0.72, 0.98, dot(d, warm) + (fine - 0.5) * 0.25);
    float wf = smoothstep(0.42, 0.85, fine * 0.6 + n * 0.55);
    col += mix(vec3(0.35, 0.08, 0.2), vec3(1.0, 0.5, 0.14), smoothstep(0.5, 0.85, wf)) * wm * wf * 0.9;
    col += vec3(1.0, 0.82, 0.55) * pow(wm * wf, 4.0) * 0.8;

    // Cool bright region, upper left.
    vec3 cool = normalize(vec3(-0.7, 0.45, -0.55));
    float cm = smoothstep(0.68, 0.97, dot(d, cool) + (fine - 0.5) * 0.3);
    col += vec3(0.15, 0.32, 0.95) * cm * smoothstep(0.4, 0.85, fine * 0.5 + n * 0.6) * 0.75;
    col += vec3(0.4, 0.4, 1.0) * pow(cm * fine, 3.0) * 0.6;

    // Dust lanes cut through the band.
    float lanes = smoothstep(0.45, 0.7, fbm(d * 4.0 + q * 3.0 + 12.0, 6)) * exp(-lat * lat * 14.0);
    col *= 1.0 - 0.85 * lanes;
    col += vec3(0.4, 0.45, 0.7) * pow(band, 3.0) * smoothstep(0.4, 0.8, fine) * 0.12 * (1.0 - lanes);

    // Star haze, densest in the band.
    vec2 s1 = cells(d * 300.0);
    vec2 s2 = cells(d * 150.0);
    float dust = smoothstep(0.3, 0.0, s1.x) * step(0.975 - band * 0.12, s1.y) * (0.15 + 0.5 * s1.y);
    dust += smoothstep(0.22, 0.0, s2.x) * step(0.96, s2.y) * 0.8;
    vec3 tint = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.88, 0.75), fract(s1.y * 7.0));
    col += tint * dust * (0.25 + band * 0.5);

    gl_FragColor = vec4(col, 1.0);
  `),
};

/* ---------- Ring density, shared by the ring and the planet (for the ring's shadow) ---------- */

export const ringDensity = /* glsl */ `
  float ringHash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
  float ringNoise(float x) { float i = floor(x); float f = fract(x); return mix(ringHash(i), ringHash(i + 1.0), f * f * (3.0 - 2.0 * f)); }
  // t: 0 at the inner edge, 1 at the outer edge.
  float ringDensity(float t) {
    if (t < 0.0 || t > 1.0) return 0.0;
    float d = 0.55 + 0.3 * ringNoise(t * 22.0) + 0.15 * ringNoise(t * 90.0) + 0.1 * ringNoise(t * 260.0);
    d *= smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.9, t);
    d *= 1.0 - 0.92 * smoothstep(0.015, 0.0, abs(t - 0.64)); // the big gap
    d *= 1.0 - 0.5 * smoothstep(0.01, 0.0, abs(t - 0.86));
    d *= mix(0.35, 1.0, smoothstep(0.18, 0.3, t));            // faint inner ring
    return clamp(d, 0.0, 1.0);
  }
`;

/* ---------- Planet ---------- */

export const planetVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vPos;
  varying vec3 vObj;
  void main() {
    vUv = uv;
    vObj = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const planetFragment = /* glsl */ `
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform vec3 uSun;
  uniform vec3 uAtmo;
  uniform float uAtmoStrength;
  uniform float uBump;
  uniform float uCloudShift;
  uniform float uEarth;
  uniform float uFade;
  uniform float uSpec;
  uniform vec3 uCenter;
  uniform float uRadius;
  uniform vec3 uRingN;
  uniform vec2 uRingR;   // inner, outer (in planet radii); 0 = no ring
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vPos;
  varying vec3 vObj;
  uniform float uDetail;
  ${noise}
  ${ringDensity}

  // Bump mapping from screen-space height derivatives (Mikkelsen).
  vec3 bump(vec3 p, vec3 n, float h) {
    vec3 dpx = dFdx(p), dpy = dFdy(p);
    float dhx = dFdx(h), dhy = dFdy(h);
    vec3 r1 = cross(dpy, n), r2 = cross(n, dpx);
    float det = dot(dpx, r1);
    vec3 g = sign(det) * (dhx * r1 + dhy * r2);
    return normalize(abs(det) * n - g);
  }

  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vPos);
    vec3 L = normalize(uSun);
    vec4 a = texture2D(uMapA, vUv);
    vec4 b = texture2D(uMapB, vUv);
    // Fine grain the texture can't hold, so close-ups stay crisp.
    float grain = uDetail > 0.0 ? (noise(vObj * 90.0) * 0.6 + noise(vObj * 230.0) * 0.4) : 0.5;
    vec3 Nb = bump(vPos, N, (a.a + (grain - 0.5) * 0.08 * uDetail) * uBump * uRadius);

    float mu = dot(N, L);
    float lit = max(dot(Nb, L), 0.0);
    float day = smoothstep(-0.12, 0.2, mu);
    vec3 albedo = a.rgb * (1.0 + (grain - 0.5) * 0.35 * uDetail);

    // Sunlight reddens as it grazes the terminator.
    vec3 sunCol = mix(vec3(1.0, 0.55, 0.3), vec3(1.0, 0.97, 0.92), smoothstep(-0.05, 0.35, mu));
    vec3 col = albedo * sunCol * lit * 2.6;

    // Ocean glint.
    vec3 H = normalize(L + V);
    float ocean = b.g * uEarth;
    float waves = 0.6 + 0.8 * grain;
    col += sunCol * pow(max(dot(Nb, H), 0.0), 600.0) * ocean * day * 1.4 * waves * uSpec;
    col += sunCol * pow(max(dot(N, H), 0.0), 40.0) * ocean * day * 0.05 * uSpec;

    // Ring shadow on the planet.
    if (uRingR.y > 0.0) {
      float t = dot(uCenter - vPos, uRingN) / dot(L, uRingN);
      if (t > 0.0) {
        float r = length(vPos + L * t - uCenter) / uRadius;
        col *= 1.0 - 0.75 * ringDensity((r - uRingR.x) / (uRingR.y - uRingR.x));
      }
    }

    // Clouds (drift on their own) with soft shadows on the ground.
    if (uEarth > 0.5) {
      float c = texture2D(uMapB, vUv + vec2(uCloudShift, 0.0)).r;
      float cs = texture2D(uMapB, vUv + vec2(uCloudShift + 0.004, 0.003)).r;
      col *= 1.0 - cs * 0.5 * day;
      vec3 cloud = vec3(0.62) * sunCol * (max(mu, 0.0) * 1.6 + 0.004);
      col = mix(col, cloud, c * 0.92);
      // City lights on the night side, under the clouds.
      float night = 1.0 - smoothstep(-0.2, 0.08, mu);
      col += vec3(1.0, 0.62, 0.28) * b.b * night * (1.0 - c * 0.85) * 2.2;
    }

    // Atmosphere seen through the limb, lit side brighter, warm at the terminator.
    float vdn = max(dot(N, V), 0.0);
    float fres = pow(1.0 - vdn, 4.0) * 0.75;
    float scatter = smoothstep(-0.35, 0.5, mu);
    vec3 atmo = mix(vec3(1.0, 0.45, 0.2), uAtmo, smoothstep(-0.1, 0.4, mu));
    col = mix(col, atmo * 0.9 * scatter, fres * uAtmoStrength);
    col += uAtmo * scatter * pow(1.0 - vdn, 1.5) * 0.05 * uAtmoStrength;

    col += albedo * 0.004;               // faint starlight on the night side
    col = 1.0 - exp(-col * 1.4);      // soft tone map
    col = pow(col, vec3(1.0 / 2.2));
    gl_FragColor = vec4(col, uFade);
  }
`;

/* ---------- Atmosphere halo: an inside-out shell drawn additively around the planet ---------- */

export const haloVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vNW;
  void main() {
    vN = normalize(normalMatrix * normal);
    vNW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const haloFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uAtmo;
  uniform float uStrength;
  uniform float uInner;   // view-space n.z at the planet's limb
  varying vec3 vN;
  varying vec3 vNW;
  void main() {
    float k = clamp(-vN.z / uInner, 0.0, 1.0);
    float glow = pow(k, 3.5);
    float sun = smoothstep(-0.45, 0.6, dot(normalize(vNW), normalize(uSun)));
    vec3 col = mix(vec3(1.0, 0.5, 0.25), uAtmo, smoothstep(-0.1, 0.5, dot(normalize(vNW), normalize(uSun))));
    gl_FragColor = vec4(col * glow * sun * uStrength, 1.0);
  }
`;

/* ---------- Rings ---------- */

export const ringVertex = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const ringFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform vec3 uCenter;
  uniform float uRadius;
  uniform vec2 uRingR;
  uniform vec3 uRingN;
  uniform float uFade;
  varying vec3 vPos;
  varying vec3 vLocal;
  ${ringDensity}
  void main() {
    float r = length(vLocal);
    float t = (r - uRingR.x) / (uRingR.y - uRingR.x);
    float dens = ringDensity(t);
    if (dens < 0.01) discard;
    vec3 L = normalize(uSun);
    // Planet shadow: does the ray toward the sun hit the sphere?
    vec3 oc = vPos - uCenter;
    float bb = dot(oc, L);
    float cc = dot(oc, oc) - uRadius * uRadius;
    float shadow = (bb < 0.0 && bb * bb - cc > 0.0) ? 0.06 : 1.0;
    // Lit face vs. light diffusing through from behind.
    vec3 V = normalize(cameraPosition - vPos);
    float sameSide = sign(dot(L, uRingN)) * sign(dot(V, uRingN));
    float light = sameSide > 0.0 ? 0.6 + 0.4 * abs(dot(L, uRingN)) : 0.25 + 0.5 * (1.0 - dens);
    vec3 col = mix(vec3(0.22, 0.17, 0.12), vec3(0.5, 0.42, 0.32), ringNoise(t * 60.0 + 3.0));
    col *= light * shadow * 1.5;
    col = 1.0 - exp(-col * 1.2);
    col = pow(col, vec3(1.0 / 2.2));
    gl_FragColor = vec4(col, dens * 0.9 * uFade);
  }
`;
