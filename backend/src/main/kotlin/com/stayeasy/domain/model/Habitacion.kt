package com.stayeasy.domain.model

import java.util.UUID

enum class EstadoHabitacion {
    LIMPIA, SUCIA, MANTENIMIENTO, OCUPADA
}

data class Habitacion(
    val id: UUID,
    val numero: Int,
    val tipoId: UUID,
    val estado: EstadoHabitacion,
    val descripcion: String? = null
)
