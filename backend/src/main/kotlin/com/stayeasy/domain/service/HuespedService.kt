package com.stayeasy.domain.service

import com.stayeasy.domain.model.Huesped
import com.stayeasy.domain.ports.HuespedRepository
import java.util.UUID

class HuespedService(private val repository: HuespedRepository) {
    fun obtenerTodos(): List<Huesped> = repository.obtenerTodos()
    fun buscarPorId(id: UUID): Huesped? = repository.buscarPorId(id)

    fun crearHuesped(huesped: Huesped): Huesped {
        // TODO: Backend developer to implement any specific business logic or validation
        return repository.save(huesped)
    }

    fun actualizarHuesped(huesped: Huesped): Huesped {
        // TODO: Backend developer to implement any specific business logic or validation
        // Ensure the guest exists before updating
        repository.buscarPorId(huesped.id) ?: throw NoSuchElementException("Huesped con ID ${huesped.id} no encontrado.")
        return repository.save(huesped)
    }

    fun eliminarHuesped(id: UUID): Boolean {
        // TODO: Backend developer to implement any specific business logic or validation
        // For example, prevent deletion if the guest has active reservations.
        return repository.delete(id)
    }
}
