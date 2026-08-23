export const EARTH_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vViewDir;
uniform sampler2D uDamage;
uniform float uDisplace;

void main() {
  vUv = uv;
  vec4 D = texture2D(uDamage, uv);
  float crater = D.r;
  float rim = smoothstep(0.04, 0.16, crater) * (1.0 - smoothstep(0.2, 0.36, crater));
  vec3 pos = position + normal * (rim * 0.038 - crater * 0.08);
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - vWorldPos;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const EARTH_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vViewDir;
uniform sampler2D uAlbedo;
uniform sampler2D uStyle;
uniform sampler2D uDamage;
uniform vec3 uSunDir;
uniform float uTime;

float toonBand(float ndl) {
  float w = fwidth(ndl) * 1.6;
  float b0 = smoothstep(0.08 - w, 0.08 + w, ndl);
  float b1 = smoothstep(0.38 - w, 0.38 + w, ndl);
  float b2 = smoothstep(0.7 - w, 0.7 + w, ndl);
  return mix(0.2, mix(0.42, mix(0.74, 1.02, b2), b1), b0);
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  vec3 L = normalize(uSunDir);
  float ndl = dot(N, L);
  float band = toonBand(ndl);

  vec3 albedo = texture2D(uAlbedo, vUv).rgb;
  float land = texture2D(uStyle, vUv).r;
  float inland = texture2D(uStyle, vUv).g;
  float ocean = 1.0 - land;

  vec3 shadowTint = vec3(0.28, 0.38, 0.62);
  vec3 sunTint = vec3(1.08, 1.03, 0.9);
  vec3 color = albedo * mix(shadowTint, sunTint, band);

  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 70.0);
  float specBlob = smoothstep(0.28, 0.5, spec);
  color += specBlob * ocean * vec3(1.0, 0.97, 0.88) * 0.9;

  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);
  color += vec3(0.65, 0.92, 1.0) * rim * 0.42 * (0.35 + 0.65 * band);

  float outline = pow(1.0 - max(dot(N, V), 0.0), 8.0);
  color = mix(color, vec3(0.07, 0.14, 0.24), outline * 0.85);

  vec4 D = texture2D(uDamage, vUv);
  float crater = D.r;
  float heat = D.g;
  float crack = D.b;

  vec3 ringDark = vec3(0.42, 0.26, 0.16);
  vec3 ringTan = vec3(0.78, 0.54, 0.3);
  vec3 ringCream = vec3(0.95, 0.78, 0.48);
  vec3 core = vec3(1.0, 0.32, 0.1);
  vec3 coreHot = vec3(1.0, 0.82, 0.28);

  float wC = max(fwidth(crater) * 2.0, 0.02);
  float scar = smoothstep(0.03, 0.1, crater);
  float b1 = smoothstep(0.05, 0.05 + wC, crater) * (1.0 - smoothstep(0.22, 0.22 + wC, crater));
  float b2 = smoothstep(0.2, 0.2 + wC, crater) * (1.0 - smoothstep(0.48, 0.48 + wC, crater));
  float b3 = smoothstep(0.46, 0.46 + wC, crater);

  color = mix(color, ringDark, scar * 0.35);
  color = mix(color, ringDark, b1);
  color = mix(color, mix(ringTan, ringCream, inland * 0.2), b2);
  vec3 glow = mix(core, coreHot, clamp(heat * 1.2, 0.0, 1.0));
  color = mix(color, glow, b3);
  color += glow * b3 * (0.35 + 0.25 * sin(uTime * 7.0 + crater * 16.0));
  color += vec3(1.0, 0.45, 0.12) * crack * (0.25 + heat * 0.4);

  gl_FragColor = vec4(color, 1.0);
}
`;

export const ATMO_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const ATMO_FRAG = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
uniform vec3 uSunDir;
uniform float uIntensity;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  float f = pow(1.0 - abs(dot(N, V)), 2.05);
  float sun = 0.62 + 0.48 * max(dot(N, normalize(uSunDir)), 0.0);
  vec3 col = mix(vec3(0.12, 0.72, 0.95), vec3(0.85, 0.98, 1.0), clamp(f, 0.0, 1.0)) * sun;
  gl_FragColor = vec4(col, f * uIntensity);
}
`;

export const CLOUD_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform sampler2D uDamage;
void main() {
  vUv = uv;
  float crater = texture2D(uDamage, uv).r;
  vec3 pos = position + normal * (0.018 - crater * 0.03);
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = cameraPosition - world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

export const CLOUD_FRAG = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;
uniform sampler2D uClouds;
uniform sampler2D uDamage;
uniform vec3 uSunDir;
void main() {
  vec4 c = texture2D(uClouds, vUv);
  float crater = texture2D(uDamage, vUv).r;
  float alpha = max(c.r, c.a) * (1.0 - crater * 1.4);
  if (alpha < 0.05) discard;
  vec3 N = normalize(vNormal);
  float ndl = dot(N, normalize(uSunDir));
  float w = fwidth(ndl) * 1.5;
  float band = mix(0.45, 1.0, smoothstep(0.15 - w, 0.15 + w, ndl));
  vec3 col = mix(vec3(0.62, 0.72, 0.82), vec3(1.0, 0.99, 0.96), band);
  float rim = pow(1.0 - max(dot(N, normalize(vViewDir)), 0.0), 2.4);
  gl_FragColor = vec4(col, alpha * 0.88 * (1.0 - rim * 0.15));
}
`;
