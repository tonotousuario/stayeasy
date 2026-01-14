package com.stayeasy.domain.ports

import com.stayeasy.domain.model.Habitacion
import com.stayeasy.domain.model.EstadoHabitacion
import java.util.UUID

interface HabitacionRepository {
    fun buscarPorId(id: UUID): Habitacion?
    fun obtenerTodas(): List<Habitacion>
    fun actualizarEstado(id: UUID, nuevoEstado: EstadoHabitacion)
}
