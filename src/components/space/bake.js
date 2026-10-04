import {
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";
import { BAKES, bakeVertex } from "./shaders";

const cache = new Map();

// Renders a procedural shader once into an equirectangular texture. Cached per renderer, kind and pass.
export function baked(gl, kind, pass = 0, width = 2048) {
  const key = `${kind}:${pass}:${width}`;
  if (cache.has(key)) return cache.get(key);
  const w = Math.min(width, gl.capabilities.maxTextureSize);
  const rt = new WebGLRenderTarget(w, w / 2, {
    generateMipmaps: true,
    minFilter: LinearMipmapLinearFilter,
    magFilter: LinearFilter,
    depthBuffer: false,
  });
  rt.texture.wrapS = RepeatWrapping;
  rt.texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const material = new ShaderMaterial({ vertexShader: bakeVertex, fragmentShader: BAKES[kind], uniforms: { uPass: { value: pass } } });
  const quad = new Mesh(new PlaneGeometry(2, 2), material);
  const scene = new Scene().add(quad);
  const prev = gl.getRenderTarget();
  gl.setRenderTarget(rt);
  gl.render(scene, new OrthographicCamera(-1, 1, 1, -1, 0, 1));
  gl.setRenderTarget(prev);
  quad.geometry.dispose();
  material.dispose();
  cache.set(key, rt.texture);
  return rt.texture;
}
