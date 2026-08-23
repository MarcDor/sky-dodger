export const EARTH_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;
varying vec3 vViewDir;
uniform sampler2D uDamage;
uniform float uDisplace;

void main() {
  vUv = uv;
  float crater = texture2D(uDamage, uv).r;
  vec3 pos = position - normal * crater * uDisplace;
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
uniform sampler2D uDay;
uniform sampler2D uNormal;
uniform sampler2D uSpec;
uniform sampler2D uDamage;
uniform vec3 uSunDir;
uniform float uTime;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewDir);
  vec3 L = normalize(uSunDir);

  vec3 nTex = texture2D(uNormal, vUv).xyz * 2.0 - 1.0;
  float theta = vUv.x * 6.2831853;
  vec3 T = normalize(vec3(-sin(theta), 0.0, -cos(theta)));
  vec3 B = normalize(cross(N, T));
  N = normalize(T * nTex.x + B * nTex.y + N * nTex.z);

  vec3 day = texture2D(uDay, vUv).rgb;
  day = pow(day, vec3(2.2));
  float ocean = texture2D(uSpec, vUv).r;
  float land = 1.0 - ocean;
  float ndl = dot(N, L);
  float dayF = smoothstep(-0.05, 0.28, ndl);

  vec3 night = day * 0.035 + vec3(0.01, 0.02, 0.05);
  float cities = land * pow(max(0.0, 1.0 - ndl), 4.0);
  cities *= smoothstep(0.55, 0.85, fract(sin(dot(vUv * 80.0, vec2(12.7, 4.2))) * 43758.0));
  night += vec3(1.0, 0.72, 0.35) * cities * 0.55;

  vec3 color = mix(night, day * (0.12 + 0.88 * max(ndl, 0.0)), dayF);

  vec3 H = normalize(L + V);
  float spec = pow(max(0.0, dot(N, H)), 42.0) * ocean * max(ndl, 0.0);
  color += spec * vec3(0.75, 0.85, 1.0) * 0.65;

  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.4);
  color += vec3(0.25, 0.5, 1.0) * rim * 0.22;

  vec4 D = texture2D(uDamage, vUv);
  float crater = D.r;
  float heat = D.g;
  float crack = D.b;

  vec3 scorch = vec3(0.04, 0.03, 0.025);
  vec3 ash = vec3(0.09, 0.06, 0.04);
  vec3 magma = vec3(1.0, 0.18, 0.02);
  vec3 lava = vec3(1.0, 0.62, 0.12);

  color = mix(color, scorch, smoothstep(0.02, 0.18, crater));
  color = mix(color, ash, smoothstep(0.16, 0.45, crater));
  float molten = smoothstep(0.28, 0.85, crater) * (0.35 + heat * 0.9);
  vec3 glow = mix(magma, lava, clamp(heat * 1.3, 0.0, 1.0));
  color = mix(color, glow, molten * 0.85);
  color += glow * molten * (0.45 + 0.35 * sin(uTime * 6.0 + crater * 18.0));
  color += vec3(1.0, 0.25, 0.05) * crack * heat * 0.65;
  color += glow * heat * heat * 0.5;

  color = mix(color, vec3(0.01, 0.0, 0.0), smoothstep(0.92, 1.0, crater) * 0.7);

  color = pow(max(color, 0.0), vec3(1.0 / 2.2));
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
  float f = pow(1.0 - abs(dot(N, V)), 2.6);
  float sun = 0.55 + 0.45 * max(dot(N, normalize(uSunDir)), 0.0);
  vec3 col = mix(vec3(0.15, 0.35, 0.95), vec3(0.55, 0.75, 1.0), f) * sun;
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
  vec3 pos = position - normal * crater * 0.02;
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
  float heat = texture2D(uDamage, vUv).g;
  float alpha = c.r * (1.0 - crater * 1.35);
  if (alpha < 0.04) discard;
  vec3 N = normalize(vNormal);
  float ndl = 0.25 + 0.75 * max(dot(N, normalize(uSunDir)), 0.0);
  vec3 col = mix(vec3(0.55, 0.58, 0.62), vec3(1.0), ndl);
  col = mix(col, vec3(0.15, 0.08, 0.05), crater);
  col = mix(col, vec3(1.0, 0.4, 0.1), heat * crater);
  float rim = pow(1.0 - max(dot(N, normalize(vViewDir)), 0.0), 2.0);
  gl_FragColor = vec4(col, alpha * 0.72 * (1.0 - rim * 0.2));
}
`;
