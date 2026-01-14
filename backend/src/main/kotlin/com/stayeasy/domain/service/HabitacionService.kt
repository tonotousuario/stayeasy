package com.stayeasy.domain.service

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.Habitacion
import com.stayeasy.domain.ports.HabitacionRepository
import java.util.UUID

class HabitacionService(private val repository: HabitacionRepository) {
    fun obtenerTodas(): List<Habitacion> = repository.obtenerTodas()
    fun actualizarEstado(id: UUID, nuevoEstado: EstadoHabitacion) = repository.actualizarEstado(id, nuevoEstado)
}
