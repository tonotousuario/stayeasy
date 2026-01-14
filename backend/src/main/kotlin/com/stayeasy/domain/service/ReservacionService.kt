package com.stayeasy.domain.service

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.ports.HabitacionRepository
import com.stayeasy.domain.ports.ReservacionRepository
import java.util.UUID

class ReservacionService(
    private val reservacionRepository: ReservacionRepository,
    private val habitacionRepository: HabitacionRepository
) {

    fun obtenerTodas(): List<Reservacion> = reservacionRepository.obtenerTodas()

    fun buscar(query: String): List<Reservacion> = reservacionRepository.buscar(query)

    fun checkIn(reservacionId: UUID) {
        val reservacion = reservacionRepository.buscarPorId(reservacionId)
            ?: throw NoSuchElementException("No se encontró la reservación con ID $reservacionId")

        reservacionRepository.actualizarEstado(reservacionId, EstadoReservacion.CHECK_IN)
        habitacionRepository.actualizarEstado(reservacion.habitacionId, EstadoHabitacion.OCUPADA)
    }

    fun crearReservacion(reservacion: Reservacion): Reservacion {
        val solapamientos = reservacionRepository.buscarPorHabitacionYFechas(
            reservacion.habitacionId,
            reservacion.fechaCheckIn,
            reservacion.fechaCheckOut
        )

        if (solapamientos.isNotEmpty()) {
            throw IllegalStateException("La habitación ya está reservada para esas fechas")
        }

        return reservacionRepository.guardar(reservacion)
    }

    fun cancelarReservacion(id: java.util.UUID) {
        reservacionRepository.cancelar(id)
    }

    fun checkOut(reservacionId: UUID) {
        val reservacion = reservacionRepository.buscarPorId(reservacionId)
            ?: throw NoSuchElementException("No se encontró la reservación con ID $reservacionId")

        // TODO: Backend developer to add logic for generating an invoice upon checkout.

        reservacionRepository.actualizarEstado(reservacionId, EstadoReservacion.CHECK_OUT)
        habitacionRepository.actualizarEstado(reservacion.habitacionId, EstadoHabitacion.SUCIA)
    }

    fun modificarReservacion(reservacion: Reservacion): Reservacion? {
        // TODO: Backend developer to implement full modification logic,
        // including validation of dates and overlaps.
        return reservacionRepository.update(reservacion)
    }

    fun eliminarReservacion(id: UUID): Boolean {
        // TODO: Backend developer to add any validation before deletion.
        return reservacionRepository.delete(id)
    }
}
