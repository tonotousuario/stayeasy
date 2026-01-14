package com.stayeasy.domain.service

import com.stayeasy.domain.model.User
import com.stayeasy.domain.model.UserRole
import com.stayeasy.domain.ports.UserRepository
import com.stayeasy.security.JwtConfig
import com.stayeasy.utils.PasswordHasher
import java.util.UUID

class UserService(private val userRepository: UserRepository) {
    fun findUserByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }

    fun registerUser(username: String, plainPassword: String, role: UserRole): User {
        if (userRepository.findByUsername(username) != null) {
            throw IllegalArgumentException("Username already exists")
        }
        val hashedPassword = PasswordHasher.hashPassword(plainPassword)
        val newUser = User(UUID.randomUUID(), username, hashedPassword, role)
        return userRepository.save(newUser)
    }

    fun loginUser(username: String, plainPassword: String): String? {
        val user = userRepository.findByUsername(username) ?: return null
        if (PasswordHasher.checkPassword(plainPassword, user.hashedPassword)) {
            return JwtConfig.generateToken(user)
        }
        return null
    }
}
