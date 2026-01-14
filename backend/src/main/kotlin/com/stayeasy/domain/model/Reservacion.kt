package com.stayeasy.domain.model

import kotlinx.serialization.Contextual
import kotlinx.serialization.Serializable
import kotlinx.serialization.modules.SerializersModule
import kotlinx.serialization.modules.contextual
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.UUID

enum class EstadoReservacion {
    CONFIRMADA, CHECK_IN, CANCELADA
}

@Serializable
data class Reservacion(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    @Serializable(with = UUIDSerializer::class)
    val huespedId: UUID,
    @Serializable(with = UUIDSerializer::class)
    val habitacionId: UUID,
    @Contextual
    val fechaCheckIn: LocalDateTime,
    @Contextual
    val fechaCheckOut: LocalDateTime,
    val tarifaTotal: Double,
    val estado: EstadoReservacion,
    val numAdultos: Int = 1,
    @Contextual
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
