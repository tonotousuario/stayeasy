package com.stayeasy.domain.model

import java.util.UUID

enum class UserRole {
    ADMIN,
    RECEPTIONIST
}

data class User(
    val id: UUID,
    val username: String,
    val hashedPassword: String,
    val role: UserRole
)
