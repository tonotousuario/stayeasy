package com.stayeasy.domain.model

import kotlinx.serialization.Serializable
import java.util.UUID

enum class EstadoHabitacion {
    LIMPIA, SUCIA, MANTENIMIENTO, OCUPADA
}

@Serializable
data class Habitacion(
    @Serializable(with = UUIDSerializer::class)
    val id: UUID,
    val numero: Int,
    @Serializable(with = UUIDSerializer::class)
    val tipoId: UUID,
    val estado: EstadoHabitacion,
    val descripcion: String? = null
)
