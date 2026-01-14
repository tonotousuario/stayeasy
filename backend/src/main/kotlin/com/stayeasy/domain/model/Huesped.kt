package com.stayeasy.domain.model

import java.util.UUID

data class Huesped(
    val id: UUID,
    val nombre: String,
    val apellido: String,
    val email: String,
    val identificacion: String
) {
    init {
        require(nombre.isNotBlank()) { "El nombre no puede estar vacío" }
        require(identificacion.isNotBlank()) { "La identificación no puede estar vacía" }
        require(isValidEmail(email)) { "El email no es válido" }
    }

    private fun isValidEmail(email: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$".toRegex()
        return email.matches(emailRegex)
    }
}
