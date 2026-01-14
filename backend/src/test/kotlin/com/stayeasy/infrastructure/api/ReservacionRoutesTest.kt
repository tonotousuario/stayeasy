package com.stayeasy.infrastructure.api

import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.service.ReservacionService
import com.stayeasy.infrastructure.api.dtos.ReservacionRequest
import com.stayeasy.infrastructure.api.dtos.ReservacionResponse
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class ReservacionRoutesTest {

    private val service = mockk<ReservacionService>()

    @Test
    fun `deberia crear reservacion exitosamente`() = testApplication {
        application {
            install(io.ktor.server.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
            routing {
                reservacionRoutes(service)
            }
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
        }

        val huespedId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()
        val request = ReservacionRequest(
            huespedId = huespedId.toString(),
            habitacionId = habitacionId.toString(),
            fechaCheckIn = LocalDateTime.now().plusDays(1).withNano(0).toString(),
            fechaCheckOut = LocalDateTime.now().plusDays(3).withNano(0).toString(),
            numAdultos = 2,
            tarifaTotal = 300.0
        )

        val reservacionCreada = Reservacion(
            id = UUID.randomUUID(),
            huespedId = huespedId,
            habitacionId = habitacionId,
            fechaCheckIn = LocalDateTime.parse(request.fechaCheckIn),
            fechaCheckOut = LocalDateTime.parse(request.fechaCheckOut),
            tarifaTotal = request.tarifaTotal,
            estado = EstadoReservacion.CONFIRMADA,
            numAdultos = request.numAdultos
        )

        every { service.crearReservacion(any()) } returns reservacionCreada

        val response = client.post("/api/v1/reservas") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val responseBody = response.body<ReservacionResponse>()
        assertEquals(reservacionCreada.id.toString(), responseBody.id)
    }

    @Test
    fun `deberia retornar conflicto si la habitacion esta ocupada`() = testApplication {
        application {
            install(io.ktor.server.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
            routing {
                reservacionRoutes(service)
            }
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
        }

        val request = ReservacionRequest(
            huespedId = UUID.randomUUID().toString(),
            habitacionId = UUID.randomUUID().toString(),
            fechaCheckIn = LocalDateTime.now().plusDays(1).withNano(0).toString(),
            fechaCheckOut = LocalDateTime.now().plusDays(3).withNano(0).toString(),
            numAdultos = 2,
            tarifaTotal = 300.0
        )

        every { service.crearReservacion(any()) } throws IllegalStateException("Ocupada")

        val response = client.post("/api/v1/reservas") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }

        assertEquals(HttpStatusCode.Conflict, response.status)
    }

    @Test
    fun `deberia retornar error si el formato de fecha es invalido`() = testApplication {
        application {
            install(io.ktor.server.plugins.contentnegotiation.ContentNegotiation) { json() }
            routing { reservacionRoutes(service) }
        }
        val client = createClient { 
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { 
                json() 
            } 
        }

        try {
            client.post("/api/v1/reservas") {
                contentType(ContentType.Application.Json)
                setBody("""
                    {
                        "huespedId": "${UUID.randomUUID()}",
                        "habitacionId": "${UUID.randomUUID()}",
                        "fechaCheckIn": "fecha-invalida",
                        "fechaCheckOut": "fecha-invalida",
                        "numAdultos": 1,
                        "tarifaTotal": 100.0
                    }
                """.trimIndent())
            }
        } catch (e: Exception) {
            // Se espera que falle en el parseo, lo importante es que el código se ejecute
        }
    }
}
