#define DARK_COLOR vec3(0.0,0.0,0.55)
#define BRIGHT_COLOR vec3(0.004,1.0,0.99)

varying float vElevation;

void main() {
    gl_FragColor = vec4(mix(BRIGHT_COLOR, DARK_COLOR, pow(clamp(vElevation, 0.0,2.0), 0.1)), 1.0);
}