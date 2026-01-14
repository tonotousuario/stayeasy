package com.stayeasy.domain.ports

import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.model.EstadoReservacion
import java.time.LocalDateTime
import java.util.UUID

interface ReservacionRepository {
    fun guardar(reservacion: Reservacion): Reservacion
    fun buscarPorId(id: UUID): Reservacion?
    fun buscarPorHabitacionYFechas(habitacionId: UUID, inicio: LocalDateTime, fin: LocalDateTime): List<Reservacion>
    fun obtenerTodas(): List<Reservacion>
    fun buscar(query: String): List<Reservacion>
    fun actualizarEstado(id: UUID, nuevoEstado: EstadoReservacion)
    fun cancelar(id: UUID)
}
