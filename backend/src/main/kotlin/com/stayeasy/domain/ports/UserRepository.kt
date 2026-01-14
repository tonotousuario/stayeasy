package com.stayeasy.domain.ports

import com.stayeasy.domain.model.User
import java.util.UUID

interface UserRepository {
    fun findByUsername(username: String): User?
    fun findById(id: UUID): User?
    fun save(user: User): User
}
