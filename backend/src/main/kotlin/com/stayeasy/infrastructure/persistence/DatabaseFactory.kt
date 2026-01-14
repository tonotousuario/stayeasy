package com.stayeasy.infrastructure.persistence

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

object DatabaseFactory {
    fun init(
        jdbcURL: String = "jdbc:postgresql://localhost:5432/stayeasy_db",
        driverClassName: String = "org.postgresql.Driver",
        user: String = "postgres",
        password: String = "password"
    ) {
        val database = Database.connect(createHikariDataSource(jdbcURL, driverClassName, user, password))
        
        transaction(database) {
            SchemaUtils.create(Huespedes, TiposHabitacion, Habitaciones, Reservaciones, Users)
        }
    }

    private fun createHikariDataSource(
        url: String,
        driver: String,
        user: String,
        pass: String
    ) = HikariDataSource(HikariConfig().apply {
        driverClassName = driver
        jdbcUrl = url
        username = user
        password = pass
        maximumPoolSize = 3
        isAutoCommit = false
        transactionIsolation = "TRANSACTION_REPEATABLE_READ"
        validate()
    })
}
