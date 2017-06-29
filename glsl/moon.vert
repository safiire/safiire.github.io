
uniform float time;
uniform vec3 cam_pos;
uniform vec2 resolution;
uniform sampler2D moon_texture;


void main(){
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
