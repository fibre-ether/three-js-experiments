varying vec2 vUv;

void main() {
    vec2 newPosition = position.xy * 2.0;
    gl_Position = vec4(newPosition, 1.0, 1.0);
    vUv = uv;   
}