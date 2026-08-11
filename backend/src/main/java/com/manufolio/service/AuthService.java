package com.manufolio.service;

import com.manufolio.dto.LoginResponse;
import com.manufolio.request.LoginRequest;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse refreshToken(String refreshToken);
}
