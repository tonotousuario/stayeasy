package com.stayeasy.infrastructure.api

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Habitacion
import com.stayeasy.domain.model.Huesped
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.service.HabitacionService
import com.stayeasy.domain.service.HuespedService
import com.stayeasy.domain.service.ReservacionService
import com.stayeasy.infrastructure.api.dtos.HuespedRequest
import com.stayeasy.infrastructure.api.dtos.HuespedResponse
import com.stayeasy.infrastructure.api.dtos.HabitacionResponse
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
                call.respond(habitacionService.obtenerTodas().map { toHabitacionResponse(it) })
            }

            patch("/{id}/estado") {
                // TODO: Backend developer to implement manual room status change logic
                val id = call.parameters["id"] ?: return@patch call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de habitación no proporcionado"))
                val request = call.receive<Map<String, String>>() // Expecting {"estado": "LIMPIA"}
                val estado = request["estado"] ?: return@patch call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Estado no proporcionado"))
                try {
                    habitacionService.actualizarEstado(UUID.fromString(id), EstadoHabitacion.valueOf(estado))
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Estado de habitación actualizado exitosamente"))
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Habitación no encontrada")))
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Estado inválido")))
                }
            }
        }
        
        route("/huespedes") {
            get {
                call.respond(huespedService.obtenerTodos().map { toHuespedResponse(it) })
            }

            get("/{id}") {
                // TODO: Backend developer to implement get huesped by ID
                val id = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de huésped no proporcionado"))
                val huesped = huespedService.buscarPorId(UUID.fromString(id))
                if (huesped != null) {
                    call.respond(HttpStatusCode.OK, toHuespedResponse(huesped))
                } else {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to "Huésped no encontrado"))
                }
            }

            post {
                // TODO: Backend developer to implement create huesped logic
                val request = call.receive<HuespedRequest>()
                try {
                    val newHuesped = huespedService.crearHuesped(
                        Huesped(
                            id = UUID.randomUUID(),
                            nombre = request.nombre,
                            apellido = request.apellido,
                            email = request.email,
                            identificacion = request.identificacion
                        )
                    )
                    call.respond(HttpStatusCode.Created, toHuespedResponse(newHuesped))
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Datos de huésped inválidos")))
                }
            }

            put("/{id}") {
                // TODO: Backend developer to implement update huesped logic
                val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de huésped no proporcionado"))
                val request = call.receive<HuespedRequest>()
                try {
                    val updatedHuesped = huespedService.actualizarHuesped(
                        Huesped(
                            id = UUID.fromString(id),
                            nombre = request.nombre,
                            apellido = request.apellido,
                            email = request.email,
                            identificacion = request.identificacion
                        )
                    )
                    call.respond(HttpStatusCode.OK, toHuespedResponse(updatedHuesped))
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Huésped no encontrado")))
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Datos de huésped inválidos")))
                }
            }

            delete("/{id}") {
                // TODO: Backend developer to implement delete huesped logic
                val id = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de huésped no proporcionado"))
                try {
                    val deleted = huespedService.eliminarHuesped(UUID.fromString(id))
                    if (deleted) {
                        call.respond(HttpStatusCode.NoContent)
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "Huésped no encontrado o no se pudo eliminar"))
                    }
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Error al eliminar huésped")))
                }
            }
        }

        route("/reservas") {
            get {
                val reservas = reservacionService.obtenerTodas()
                call.respond(reservas.map { toResponse(it) })
            }

            get("/buscar") {
                val query = call.request.queryParameters["q"]
                if (query.isNullOrBlank()) {
                    call.respond(HttpStatusCode.BadRequest, "El parámetro 'q' es requerido")
                    return@get
                }
                val resultados = reservacionService.buscar(query)
                call.respond(resultados.map { toResponse(it) })
            }

            patch("/{id}/check-in") {
                val id = call.parameters["id"] ?: return@patch call.respond(HttpStatusCode.BadRequest, "ID de reserva no proporcionado")
                try {
                    reservacionService.checkIn(UUID.fromString(id))
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Check-in realizado exitosamente"))
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Reserva no encontrada")))
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Error al realizar check-in")))
                }
            }

            post {
                try {
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
    
                    val creada = reservacionService.crearReservacion(reservacion)
                    call.respond(HttpStatusCode.Created, toResponse(creada))
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to e.message))
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Argumento inválido")))
                }
            }

            put("/{id}") {
                // TODO: Backend developer to implement update logic
                val id = call.parameters["id"] ?: return@put call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de reserva no proporcionado"))
                try {
                    val request = call.receive<ReservacionRequest>()
                    val updatedReservacion = reservacionService.modificarReservacion(
                        Reservacion(
                            id = UUID.fromString(id),
                            huespedId = UUID.fromString(request.huespedId),
                            habitacionId = UUID.fromString(request.habitacionId),
                            fechaCheckIn = LocalDateTime.parse(request.fechaCheckIn),
                            fechaCheckOut = LocalDateTime.parse(request.fechaCheckOut),
                            tarifaTotal = request.tarifaTotal,
                            estado = EstadoReservacion.valueOf(request.estado), // Assuming status can be updated via request
                            numAdultos = request.numAdultos
                        )
                    )
                    if (updatedReservacion != null) {
                        call.respond(HttpStatusCode.OK, toResponse(updatedReservacion))
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reserva no encontrada"))
                    }
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Reserva no encontrada")))
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Argumento inválido")))
                }
            }

            delete("/{id}") {
                // TODO: Backend developer to implement delete logic
                val id = call.parameters["id"] ?: return@delete call.respond(HttpStatusCode.BadRequest, mapOf("error" to "ID de reserva no proporcionado"))
                try {
                    val deleted = reservacionService.eliminarReservacion(UUID.fromString(id))
                    if (deleted) {
                        call.respond(HttpStatusCode.NoContent)
                    } else {
                        call.respond(HttpStatusCode.NotFound, mapOf("error" to "Reserva no encontrada o no se pudo eliminar"))
                    }
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Reserva no encontrada")))
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Error al eliminar reserva")))
                }
            }

            post("/{id}/checkout") {
                // TODO: Backend developer to implement checkout logic
                val id = call.parameters["id"] ?: return@post call.respond(HttpStatusCode.BadRequest, "ID de reserva no proporcionado")
                try {
                    reservacionService.checkOut(UUID.fromString(id))
                    call.respond(HttpStatusCode.OK, mapOf("message" to "Check-out realizado exitosamente"))
                } catch (e: NoSuchElementException) {
                    call.respond(HttpStatusCode.NotFound, mapOf("error" to (e.message ?: "Reserva no encontrada")))
                } catch (e: IllegalStateException) {
                    call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Error al realizar check-out")))
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

private fun toHuespedResponse(h: Huesped) = HuespedResponse(
    id = h.id.toString(),
    nombre = h.nombre,
    apellido = h.apellido,
    email = h.email,
    identificacion = h.identificacion
)

private fun toHabitacionResponse(hab: Habitacion) = HabitacionResponse(
    id = hab.id.toString(),
    numero = hab.numero,
    tipoId = hab.tipoId.toString(),
    estado = hab.estado.name,
    descripcion = hab.descripcion
)