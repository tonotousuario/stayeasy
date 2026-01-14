package com.stayeasy

import com.stayeasy.domain.model.LocalDateTimeSerializer
import com.stayeasy.domain.service.HabitacionService
import com.stayeasy.domain.service.HuespedService
import com.stayeasy.domain.service.ReservacionService
import com.stayeasy.infrastructure.adapters.PostgresHabitacionRepository
import com.stayeasy.infrastructure.adapters.PostgresHuespedRepository
import com.stayeasy.infrastructure.adapters.PostgresReservacionRepository
import com.stayeasy.infrastructure.api.reservacionRoutes
import com.stayeasy.infrastructure.persistence.DataSeeder
import com.stayeasy.infrastructure.persistence.DatabaseFactory
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.contextual

fun main() {
    embeddedServer(Netty, port = 8080, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    // Database
    DatabaseFactory.init()
    DataSeeder.seed()

    // Repositories
    val reservacionRepository = PostgresReservacionRepository()
    val habitacionRepository = PostgresHabitacionRepository()
    val huespedRepository = PostgresHuespedRepository()

    // Services
    val reservacionService = ReservacionService(reservacionRepository, habitacionRepository)
    val habitacionService = HabitacionService(habitacionRepository)
    val huespedService = HuespedService(huespedRepository)

    // CORS
    install(CORS) {
        allowMethod(HttpMethod.Options)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowHeader(HttpHeaders.Authorization)
        allowHeader(HttpHeaders.ContentType)
        anyHost()
    }

    // JSON
    install(ContentNegotiation) {
        json(Json {
            serializersModule = SerializersModule {
                contextual(LocalDateTimeSerializer)
            }
            ignoreUnknownKeys = true // Añadido para robustez
        })
    }

    // Routes
    routing {
        reservacionRoutes(reservacionService, habitacionService, huespedService)
    }
}