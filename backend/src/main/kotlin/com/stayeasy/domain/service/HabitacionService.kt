package com.stayeasy.domain.service

import com.stayeasy.domain.model.Habitacion
import com.stayeasy.domain.ports.HabitacionRepository

class HabitacionService(private val repository: HabitacionRepository) {
    fun obtenerTodas(): List<Habitacion> = repository.obtenerTodas()
}
