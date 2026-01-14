package com.stayeasy.domain.ports

import com.stayeasy.domain.model.Reservacion
import java.time.LocalDateTime
import java.util.UUID

interface ReservacionRepository {
    fun guardar(reservacion: Reservacion): Reservacion
    fun buscarPorId(id: UUID): Reservacion?
    fun buscarPorHabitacionYFechas(habitacionId: UUID, inicio: LocalDateTime, fin: LocalDateTime): List<Reservacion>
    fun obtenerTodas(): List<Reservacion>
    fun cancelar(id: UUID)
}
