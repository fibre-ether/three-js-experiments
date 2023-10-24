struct ray {
    vec3 origin;
    vec3 direction;
};

vec3 ray_at(ray r, float t) {
    return r.origin + t * r.direction;
}
