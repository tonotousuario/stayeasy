package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.User
import com.stayeasy.domain.model.UserRole
import com.stayeasy.domain.ports.UserRepository
import com.stayeasy.infrastructure.persistence.Users
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import java.util.UUID

class PostgresUserRepository : UserRepository {
    override fun findByUsername(username: String): User? {
        return transaction {
            Users.selectAll().where { Users.username eq username }
                .map { toUser(it) }
                .singleOrNull()
        }
    }

    override fun findById(id: UUID): User? {
        return transaction {
            Users.selectAll().where { Users.id eq id }
                .map { toUser(it) }
                .singleOrNull()
        }
    }

    override fun save(user: User): User {
        transaction {
            val existingUser = Users.selectAll().where { Users.id eq user.id }.singleOrNull()
            if (existingUser == null) {
                Users.insert {
                    it[id] = user.id
                    it[username] = user.username
                    it[hashedPassword] = user.hashedPassword
                    it[role] = user.role.name
                }
            } else {
                Users.update({ Users.id eq user.id }) {
                    it[username] = user.username
                    it[hashedPassword] = user.hashedPassword
                    it[role] = user.role.name
                }
            }
        }
        return user
    }

    private fun toUser(row: ResultRow): User {
        return User(
            id = row[Users.id],
            username = row[Users.username],
            hashedPassword = row[Users.hashedPassword],
            role = UserRole.valueOf(row[Users.role])
        )
    }
}
