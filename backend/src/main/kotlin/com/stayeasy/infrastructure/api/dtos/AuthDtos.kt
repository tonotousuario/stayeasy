package com.stayeasy.infrastructure.api.dtos

import kotlinx.serialization.Serializable

@Serializable
data class LoginRequest(
    val username: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val token: String
)

@Serializable
data class RegisterRequest(
    val username: String,
    val password: String,
    val role: String // "ADMIN" or "RECEPTIONIST"
)
