float focal_length = 1.0;
float viewport_height = 2.0;

vec3 ray_color(ray r, hittable_list world) {
    hit_record rec;
    if(hit(world, RAY_T_MIN, RAY_T_MAX, rec, r)) {
        return 0.5 * (rec.normal + vec3(1.0));
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
    float pixel_x = (vUv.x) * uRenderSize.x;
    float pixel_y = (1.0 - vUv.y) * uRenderSize.y;

    vec3 pixel_center = pixel00_loc + (pixel_x * pixel_delta_u) + (pixel_y * pixel_delta_v);
    vec3 ray_direction = pixel_center - camera;
    ray r = ray(camera, ray_direction);

    // initializing list of all hittable objects
    hittable_list world;
    generate_hittables(world, uHittables);

    vec3 pixel_color = ray_color(r, world);
    gl_FragColor = vec4(pixel_color, 1.0);
}