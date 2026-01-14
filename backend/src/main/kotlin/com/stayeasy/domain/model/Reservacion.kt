package com.stayeasy.domain.model

import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.UUID

enum class EstadoReservacion {
    CONFIRMADA, CHECK_IN, CANCELADA
}

data class Reservacion(
    val id: UUID,
    val huespedId: UUID,
    val habitacionId: UUID,
    val fechaCheckIn: LocalDateTime,
    val fechaCheckOut: LocalDateTime,
    val tarifaTotal: Double,
    val estado: EstadoReservacion,
    val numAdultos: Int = 1,
    val fechaCreacion: LocalDateTime = LocalDateTime.now()
) {
    init {
        require(fechaCheckOut.isAfter(fechaCheckIn)) { "La fecha de check-out debe ser posterior a la de check-in" }
        require(tarifaTotal >= 0) { "La tarifa total no puede ser negativa" }
    }

    fun duracionEstanciaDias(): Long {
        return ChronoUnit.DAYS.between(fechaCheckIn.toLocalDate(), fechaCheckOut.toLocalDate())
    }
}
