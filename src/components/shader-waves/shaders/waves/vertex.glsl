#define PI 3.14159

uniform float uTime;
uniform float uWaveSpeed;
uniform float uWaveDensity;
uniform float uRandomness;

varying vec3 vNormal;

float smoothMod(float axis, float amp, float rad){
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

void main() {

    float modifiedPosition = position.y*uWaveDensity + uTime * uWaveSpeed + sin(position.x * uRandomness);
    float elevation = smoothMod(modifiedPosition,1.0,0.5);

    vec4 modelPosition = modelMatrix * vec4(position + normal * elevation * 1.0,1.0);

    vNormal = normal;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
}