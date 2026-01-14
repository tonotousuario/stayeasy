package com.stayeasy

import com.stayeasy.domain.service.ReservacionService
import com.stayeasy.infrastructure.adapters.PostgresReservacionRepository
import com.stayeasy.infrastructure.api.reservacionRoutes
import com.stayeasy.infrastructure.persistence.DatabaseFactory
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Database
    DatabaseFactory.init()

    // Repositories
    val reservacionRepository = PostgresReservacionRepository()

    // Services
    val reservacionService = ReservacionService(reservacionRepository)

    // JSON
    install(ContentNegotiation) {
        json()
    }

    // Routes
    routing {
        reservacionRoutes(reservacionService)
    }
}
