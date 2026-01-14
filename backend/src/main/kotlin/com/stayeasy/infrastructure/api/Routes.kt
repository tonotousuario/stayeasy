package com.stayeasy.infrastructure.api

import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.service.HabitacionService
import com.stayeasy.domain.service.HuespedService
import com.stayeasy.domain.service.ReservacionService
import com.stayeasy.infrastructure.api.dtos.ReservacionRequest
import com.stayeasy.infrastructure.api.dtos.ReservacionResponse
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.time.LocalDateTime
import java.util.UUID

fun Route.reservacionRoutes(
    reservacionService: ReservacionService,
    habitacionService: HabitacionService,
    huespedService: HuespedService
) {
    route("/api/v1") {
        
        route("/habitaciones") {
            get {
                call.respond(habitacionService.obtenerTodas())
            }
        }
        
        route("/huespedes") {
            get {
                call.respond(huespedService.obtenerTodos())
            }
        }

        route("/reservas") {
            get {
                val reservas = reservacionService.obtenerTodas()
                call.respond(reservas.map { toResponse(it) })
            }

            post {
                val request = call.receive<ReservacionRequest>()
                
                val reservacion = Reservacion(
                    id = UUID.randomUUID(),
                    huespedId = UUID.fromString(request.huespedId),
                    habitacionId = UUID.fromString(request.habitacionId),
                    fechaCheckIn = LocalDateTime.parse(request.fechaCheckIn),
                    fechaCheckOut = LocalDateTime.parse(request.fechaCheckOut),
                    tarifaTotal = request.tarifaTotal,
                    estado = EstadoReservacion.CONFIRMADA,
                    numAdultos = request.numAdultos
                )

                try {
                    val creada = reservacionService.crearReservacion(reservacion)
                    call.respond(HttpStatusCode.Created, toResponse(creada))
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to e.message))
                }
            }
        }
    }
}

private fun toResponse(r: Reservacion) = ReservacionResponse(
    id = r.id.toString(),
    huespedId = r.huespedId.toString(),
    habitacionId = r.habitacionId.toString(),
    fechaCheckIn = r.fechaCheckIn.toString(),
    fechaCheckOut = r.fechaCheckOut.toString(),
    estado = r.estado.name,
    tarifaTotal = r.tarifaTotal
)