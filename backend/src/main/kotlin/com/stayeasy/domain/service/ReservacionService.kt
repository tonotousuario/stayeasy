package com.stayeasy.domain.service

import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.ports.ReservacionRepository

class ReservacionService(private val repository: ReservacionRepository) {

    fun crearReservacion(reservacion: Reservacion): Reservacion {
        val solapamientos = repository.buscarPorHabitacionYFechas(
            reservacion.habitacionId,
            reservacion.fechaCheckIn,
            reservacion.fechaCheckOut
        )

        if (solapamientos.isNotEmpty()) {
            throw IllegalStateException("La habitación ya está reservada para esas fechas")
        }

        return repository.guardar(reservacion)
    }

    fun cancelarReservacion(id: java.util.UUID) {
        repository.cancelar(id)
    }
}
