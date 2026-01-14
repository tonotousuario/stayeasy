package com.stayeasy.infrastructure.api.dtos

import kotlinx.serialization.Serializable

@Serializable
data class HabitacionResponse(
    val id: String,
    val numero: Int,
    val tipoId: String,
    val estado: String,
    val descripcion: String? = null
)
