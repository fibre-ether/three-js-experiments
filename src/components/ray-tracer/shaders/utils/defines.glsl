#define RAY_T_MIN 0.001
#define RAY_T_MAX 99999999.9
#define PI 3.1415926536
#define RECURSION_DEPTH 10
#define SAMPLE_PER_PIXEL 2

struct HittableJS {
  vec3 center;
  float radius;
  int material;
  vec3 color;
};

struct hit_record {
    vec3 p;
    vec3 normal;
    vec3 color;
    float t;
    bool front_face;
    int material;
};

struct hittable {
    vec3 center;
    float radius;
    int material;
    vec3 color;
};

struct hittable_list {
    hittable objects[NUM_HITTABLES];
};

uniform float uTime;
uniform vec2 uRenderSize;
uniform vec3 uCameraPosition;
uniform HittableJS uHittables[NUM_HITTABLES];
uniform float uSkyBrightness;

varying vec2 vUv;
