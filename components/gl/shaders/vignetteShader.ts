export const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null }, // provided by ShaderPass
    darkness: { value: 1.0 }, // strength of the vignette effect
    offset: { value: 1.0 }, // vignette offset
    isLightMode: { value: false }, // whether to use light mode vignette
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    uniform bool isLightMode;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);

      // Calculate distance from center
      vec2 uv = (vUv - 0.5) * 2.0;
      float dist = dot(uv, uv);

      // Create vignette effect
      float vignette = 1.0 - smoothstep(offset, offset + darkness, dist);

      if (isLightMode) {
        // In light mode, add white to edges instead of darkening
        vec3 white = vec3(1.0);
        float lightVignette = smoothstep(offset, offset + darkness, dist);
        gl_FragColor = vec4(mix(texel.rgb, white, lightVignette * 0.6), texel.a);
      } else {
        // Dark mode: darken edges
        gl_FragColor = vec4(texel.rgb * vignette, texel.a);
      }
    }
  `,
};
