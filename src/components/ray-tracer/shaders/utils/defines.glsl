#define RAY_T_MIN 0.001
#define RAY_T_MAX 99999999.9
#define PI 3.1415926536
#define RECURSION_DEPTH 10
#define SAMPLE_PER_PIXEL 1

uniform vec2 uRenderSize;
uniform vec3 uCameraPosition;
uniform vec4 uHittables[NUM_HITTABLES];

varying vec2 vUv;