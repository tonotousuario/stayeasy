package com.stayeasy.infrastructure.api.dtos

import kotlinx.serialization.Serializable

@Serializable
data class HuespedRequest(
    val id: String? = null, // For update, optional for create
    val nombre: String,
    val apellido: String,
    val email: String,
    val identificacion: String
)

@Serializable
data class HuespedResponse(
    val id: String,
    val nombre: String,
    val apellido: String,
    val email: String,
    val identificacion: String
)