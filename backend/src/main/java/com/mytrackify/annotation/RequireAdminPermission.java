package com.mytrackify.annotation;

import com.mytrackify.enums.AdminLevel;

import java.lang.annotation.*;

/**
 * Declares the minimum admin level (and optional specific permission / scope)
 * required to invoke the annotated controller method. Enforced by
 * {@code AdminPermissionAspect}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireAdminPermission {
    AdminLevel minLevel() default AdminLevel.MODERATOR;

    String permission() default "";

    String scope() default "";

    String description() default "Admin access required";
}
