
uniform float time;
uniform vec3 cam_pos;
uniform vec2 resolution;
uniform sampler2D moon_texture;

const float pi = 3.14159265359;
const float tau = 2.0 * pi;
const float epsilon = 0.0000000001;

float map(vec3 p){
  vec3 q = fract(p) * 2.0 - 1.0;
  return length(q) - 0.25;
}

float trace(vec3 o, vec3 r){
  float t = 0.0;
  for(int i = 0; i < 32; i++){
    vec3 p = o + r * t;
    float d = map(p);
    t += d * 0.5;
  }
  return t;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution;
  uv = uv * 2.0 - 1.0;
  uv.x *= resolution.x / resolution.y;

  float theta = time * 0.25;
  vec3 r = normalize(vec3(uv, 1.0));
  vec3 o = vec3(0.0, 0.0, -3.0) * time * -0.5;
  r.xy *= mat2(cos(theta), -sin(theta), sin(theta), cos(theta));

  float t = trace(o, r);
  float fog = 1.0 / (1.0 + t * t * 0.1);

  vec3 fc = vec3(fog) * vec3(0.4 * sin(time) * 0.5 + 1.0, 0.0, 0.4 * cos(time) * 0.5 + 1.0);

  gl_FragColor = vec4(fc, 1.0);
}
