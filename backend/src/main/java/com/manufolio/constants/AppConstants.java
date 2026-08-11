package com.manufolio.constants;

public final class AppConstants {

    private AppConstants() {}

    // Pagination defaults
    public static final int DEFAULT_PAGE_NUMBER = 0;
    public static final int DEFAULT_PAGE_SIZE    = 10;
    public static final String DEFAULT_SORT_BY   = "sentAt";
    public static final String DEFAULT_SORT_DIR  = "desc";

    // JWT
    public static final String BEARER_PREFIX     = "Bearer ";
    public static final String AUTH_HEADER        = "Authorization";

    // Roles
    public static final String ROLE_ADMIN        = "ADMIN";
    public static final String ROLE_MODERATOR    = "MODERATOR";
}
