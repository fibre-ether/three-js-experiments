#define DARK_COLOR vec3(0.0,0.0,0.5)
#define BRIGHT_COLOR vec3(0.004,1.0,0.99)
#define LIGHT_DIRECTION1 vec3(1.0,0.0,0.0)
#define LIGHT_DIRECTION2 vec3(-1.0,0.0,0.0)

varying vec3 vNormal;

void main() {
    float strength1 = max(0.0,dot(LIGHT_DIRECTION1, vNormal) * 0.75);
    float strength2 = max(0.0,dot(LIGHT_DIRECTION2, vNormal) * 0.75);

    float strength = strength1 + strength2;

    vec3 color = mix(DARK_COLOR, BRIGHT_COLOR, pow(strength,1.0));

    gl_FragColor = vec4(color,1.0);
}