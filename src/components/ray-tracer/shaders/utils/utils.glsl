float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p3)
{
	vec3 new_p3  = fract(p3 * .1031);
    new_p3 += dot(new_p3, new_p3.zyx + 31.32);
    return fract((new_p3.x + new_p3.y) * new_p3.z);
}

float random(vec2 st) {
    return clamp(hash12(st), 0.0, 1.0);
    // return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float random(vec3 st) {
    return clamp(hash13(st), 0.0, 1.0);
    // return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float random_range(vec2 st, float min, float max) {
    return min + (max - min) * random(st);
}

vec3 random_3d(vec3 st, float min, float max) {
    return vec3(random_range(st.xy, min, max), random_range(st.yz, min, max), random_range(st.zx, min, max));
}

vec3 random_unit_vector(vec3 ray) {
    return normalize(random_3d(random_3d(ray, -1.0, 1.0),-1.0,1.0));
    // while(true) {
    //     vec3 p = random_3d(random_3d(ray, -1.0, 1.0), -1.0,1.0);
    //     if(dot(p, p) < 1.0) {
    //         return normalize(p);
    //     }
    // }
}

vec3 random_on_hemisphere(vec3 ray, vec3 normal) {
    vec3 unit_vector = random_unit_vector(ray);
    float is_vector_on_hemi = float(dot(unit_vector, normal) > 0.0);
    return is_vector_on_hemi * unit_vector + (1.0-is_vector_on_hemi)*(-unit_vector);
    // if(dot(unit_vector, normal) > 0.0) {
    //     return unit_vector;
    // } else {
    //     return -unit_vector;
    // }
}