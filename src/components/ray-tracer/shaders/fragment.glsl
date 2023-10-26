float focal_length = 1.0;
float viewport_height = 2.0;

vec3 pixel_sample_square(vec3 delta_u, vec3 delta_v, float sample_index) {
    float px = -0.5 + random(delta_u+sample_index);
    float py = -0.5 + random(delta_v+sample_index);
    return (px * delta_u) + (py * delta_v);
}
ray get_ray(float i, float j, vec3 center, vec3 loc_00, vec3 delta_u, vec3 delta_v, float sample_index) {
    vec3 pixel_center = loc_00 + (i * delta_u) + (j * delta_v);
    vec3 pixel_sample = pixel_center + pixel_sample_square(delta_u, delta_v, sample_index);

    vec3 ray_origin = center;
    vec3 ray_direction = pixel_sample - ray_origin;

    return ray(ray_origin, ray_direction);
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

    vec3 pixel_color = vec3(0.0);
    for(int i = 0; i < SAMPLE_PER_PIXEL; ++i) {
        ray r = get_ray(pixel_x, pixel_y,camera , pixel00_loc, pixel_delta_u, pixel_delta_v, float(i));
        pixel_color += ray_color(r, world);
    }

    pixel_color /= float(SAMPLE_PER_PIXEL);
    //ray_color(r, world);
    gl_FragColor = vec4(pixel_color, 1.0);
}