package com.stayeasy.infrastructure.api.dtos

import kotlinx.serialization.Serializable

@Serializable
data class ReservacionRequest(
    val huespedId: String,
    val habitacionId: String,
    val fechaCheckIn: String,
    val fechaCheckOut: String,
    val numAdultos: Int,
    val tarifaTotal: Double
)

@Serializable
data class ReservacionResponse(
    val id: String,
    val huespedId: String,
    val habitacionId: String,
    val fechaCheckIn: String,
    val fechaCheckOut: String,
    val estado: String,
    val tarifaTotal: Double
)
