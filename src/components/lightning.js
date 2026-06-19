"use client";
import { useRef, useEffect } from 'react';
import './Lightning.css';

const VERT_SHADER = `attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG_SHADER = `
  precision mediump float;
  uniform vec2 iRes;
  uniform float iTime,uHue,uSat,uBright,uThick,uWaver,uZoom,uSpeed,uTurb,uFlicker,uYOff,uGPow;
  uniform int uOct;

  vec3 hsv2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6. + vec3(0.,4.,2.), 6.) - 3.) - 1., 0., 1.);
    return c.z * mix(vec3(1.), rgb, c.y);
  }

  float hash12(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  float noise(vec2 p){
    vec2 ip = floor(p), fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1., 0.));
    float c = hash12(ip + vec2(0., 1.));
    float d = hash12(ip + vec2(1., 1.));
    vec2 t = smoothstep(0., 1., fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
  }

  float fbm(vec2 p, int oct, float turb){
    float v = 0., a = 0.5;
    for(int i = 0; i < 10; i++){
      if(i >= oct) break;
      v += a * noise(p);
      p *= rot(0.45);
      p *= 2.;
      a *= turb;
    }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / iRes;
    uv = 2.0 * uv - 1.0;
    uv.y *= iRes.y / iRes.x;
    uv.y += uYOff;
    uv.y += uWaver * fbm(uv * uZoom + 0.25 * iTime * uSpeed, uOct, uTurb) - uWaver * 0.5;
    float dist = abs(uv.y);
    float glow = uThick + uFlicker * sin(iTime * 2.0 * uSpeed);
    float coloredHalo = pow(glow / (dist + 0.12), uGPow);
    float whiteCore = pow(glow * 0.4 / (dist + 0.018), uGPow * 1.5);
    vec3 boltCol = hsv2rgb(vec3(uHue / 360.0, uSat, 1.0));
    vec3 col = boltCol * coloredHalo * uBright;
    col += vec3(1.0) * whiteCore * uBright;
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;
const QUAD_VERTICES = new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);

const Lightning = ({
  hue = 210,
  xOffset = 0.2,
  speed = 1,
  intensity = 1.05,
  size = 4.6,
  saturation = 1,
  thickness = 0.05,
  waver = 0.5,
  turbulence = 0.5,
  flicker = 0,
  octaves = 10,
  glowPower = 2.5,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.floor(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const mkShader = (src, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(VERT_SHADER, gl.VERTEX_SHADER));
    gl.attachShader(prog, mkShader(FRAG_SHADER, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    const ap = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(ap);
    gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      res: gl.getUniformLocation(prog, 'iRes'),
      t: gl.getUniformLocation(prog, 'iTime'),
      hue: gl.getUniformLocation(prog, 'uHue'),
      sat: gl.getUniformLocation(prog, 'uSat'),
      bright: gl.getUniformLocation(prog, 'uBright'),
      thick: gl.getUniformLocation(prog, 'uThick'),
      waver: gl.getUniformLocation(prog, 'uWaver'),
      zoom: gl.getUniformLocation(prog, 'uZoom'),
      speed: gl.getUniformLocation(prog, 'uSpeed'),
      turb: gl.getUniformLocation(prog, 'uTurb'),
      flicker: gl.getUniformLocation(prog, 'uFlicker'),
      yoff: gl.getUniformLocation(prog, 'uYOff'),
      oct: gl.getUniformLocation(prog, 'uOct'),
      gpow: gl.getUniformLocation(prog, 'uGPow'),
    };

    const start = performance.now();
    let frameId = 0;

    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(locs.res, canvas.width, canvas.height);
      gl.uniform1f(locs.t, (performance.now() - start) * 0.001);
      gl.uniform1f(locs.hue, hue);
      gl.uniform1f(locs.sat, saturation);
      gl.uniform1f(locs.bright, intensity);
      gl.uniform1f(locs.thick, thickness);
      gl.uniform1f(locs.waver, waver);
      gl.uniform1f(locs.zoom, size);
      gl.uniform1f(locs.speed, speed);
      gl.uniform1f(locs.turb, turbulence);
      gl.uniform1f(locs.flicker, flicker);
      gl.uniform1f(locs.yoff, xOffset);
      gl.uniform1i(locs.oct, octaves);
      gl.uniform1f(locs.gpow, glowPower);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(frameId);
    };
  }, [hue, xOffset, speed, intensity, size, saturation, thickness, waver, turbulence, flicker, octaves, glowPower]);

  return <canvas ref={canvasRef} className="lightning-container" />;
};

export default Lightning;
