void generate_hittables(inout hittable_list self, HittableJS hittables[NUM_HITTABLES]) {
    for(int i = 0; i < NUM_HITTABLES; i++) {
        self.objects[i] = hittable(hittables[i].center, hittables[i].radius, hittables[i].material, hittables[i].color);
    }
}

void set_face_normal(inout hit_record self, ray r, vec3 outward_normal) {
    self.front_face = dot(r.direction, outward_normal) < 0.0;
    self.normal = self.front_face ? outward_normal : -outward_normal;
}

// hittable hit method
bool hit(hittable self, float ray_tmin, float ray_tmax, inout hit_record rec, ray r) {
    vec3 oc = r.origin - self.center;
    float a = dot(r.direction, r.direction);
    float half_b = dot(oc, r.direction);
    float c = dot(oc, oc) - self.radius * self.radius;

    float discriminant = half_b * half_b - a * c;
    if(discriminant < 0.0)
        return false;

    float sqrtd = sqrt(discriminant);
    float root = (-half_b - sqrtd) / a;

    if(root <= ray_tmin || ray_tmax <= root) {
        root = (-half_b + sqrtd) / a;
        if(root <= ray_tmin || ray_tmax <= root)
            return false;
    }

    rec.t = root;
    rec.p = ray_at(r, rec.t);
    rec.color = self.color;
    rec.material = self.material;
    vec3 outward_normal = (rec.p - self.center) / self.radius;
    set_face_normal(rec, r, outward_normal);

    return true;
}

// hittable_list hit method
bool hit(hittable_list self, float ray_tmin, float ray_tmax, inout hit_record rec, ray r) {
    hit_record temp_rec;
    bool hit_anything = false;
    float closest_so_far = ray_tmax;

    for(int i = 0; i < NUM_HITTABLES; i++) {
        if(hit(self.objects[i], ray_tmin, ray_tmax, temp_rec, r)) {
            hit_anything = true;
            if(temp_rec.t < closest_so_far) {
                closest_so_far = temp_rec.t;
                rec = temp_rec;
            }
        }
    }

    return hit_anything;
}

vec3 ray_color(ray r, hittable_list world) {
    vec3 color = vec3(1.0, 1.0, 1.0);
    vec3 BLACK = vec3(0.0, 0.0, 0.0);
    vec3 WHITE = vec3(1.0, 1.0, 1.0);
    float num_reflections = 0.0;
    float reflectance = 0.5;

    for(int i = 0; i < RECURSION_DEPTH; i++) {
        hit_record rec;
        bool did_hit = hit(world, RAY_T_MIN, RAY_T_MAX, rec, r);
        bool is_light = rec.material == 2;
        if(did_hit && !is_light) {
            num_reflections += 1.0;
            r = ray(rec.p, get_reflected_direction(rec, r));
            color *= rec.color;
        } else {
            // vec3 unit_direction = normalize(r.direction);
            vec3 return_color = !did_hit ? color * get_background(normalize(r.direction)) : rec.color;
            // return pow(reflectance, num_reflections) * (color * (float(did_hit) * rec.color));
            return pow(reflectance, num_reflections) * (return_color);
            
        }
    }
    return pow(reflectance, num_reflections) * BLACK;
}
