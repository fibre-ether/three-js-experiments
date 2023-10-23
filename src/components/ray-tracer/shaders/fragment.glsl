uniform vec2 uRenderSize;
uniform vec3 uCameraPosition;

varying vec2 vUv;

float focal_length = 1.0;
float viewport_height = 2.0;

struct ray {
    vec3 origin;
    vec3 direction;
};

vec3 rayAt(ray r, float t) {
    return r.origin + t * r.direction;
}

float hit_sphere(vec3 center, float radius, ray r) {
    vec3 oc = r.origin - center;
    float a = dot(r.direction, r.direction);
    float half_b = dot(oc, r.direction);
    float c = dot(oc, oc) - radius * radius;
    
    float discriminant = half_b * half_b - a * c;
    if(discriminant < 0.0) {
        return -1.0;
    } else {
        return (-half_b - sqrt(discriminant)) / (2.0 * a);
    }
}

vec3 ray_color(ray r) {
    vec3 centerOfCircle = vec3(0.0, 0.0, -1.0);
    float t = hit_sphere(centerOfCircle, 0.5, r);
    if(t > 0.0) {
        vec3 N = normalize(rayAt(r, t) - centerOfCircle);
        return 0.5 * vec3(N.x + 1.0, N.y + 1.0, N.z + 1.0);
    }
    vec3 unit_direction = normalize(r.direction);
    float a = 0.5 * (unit_direction.y + 1.0);
    return (1.0 - a) * vec3(1.0) + a * vec3(0.5, 0.7, 1.0);
}

void main() {
    //static variables
    vec3 camera = uCameraPosition;
    float aspect_ratio = uRenderSize.x / uRenderSize.y;
    float viewport_width = viewport_height * aspect_ratio;

    vec3 viewport_u = vec3(viewport_width, 0.0, 0.0);
    vec3 viewport_v = vec3(0.0, -viewport_height, 0.0);

    vec3 pixel_delta_u = viewport_u / uRenderSize.x;
    vec3 pixel_delta_v = viewport_v / uRenderSize.y;

    vec3 viewport_upper_left = camera - vec3(0.0, 0.0, focal_length) - viewport_u / 2.0 - viewport_v / 2.0;
    vec3 pixel00_loc = viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);

    // per pixel calculations
    // 1.0 - uv to match with rtiaw's example
    float pixel_x = (1.0 - vUv.x) * uRenderSize.x;
    float pixel_y = (1.0 - vUv.y) * uRenderSize.y;

    vec3 pixel_center = pixel00_loc + (pixel_x * pixel_delta_u) + (pixel_y * pixel_delta_v);
    vec3 ray_direction = pixel_center - camera;
    ray r = ray(camera, ray_direction);

    vec3 pixel_color = ray_color(r);
    gl_FragColor = vec4(pixel_color, 1.0);
}