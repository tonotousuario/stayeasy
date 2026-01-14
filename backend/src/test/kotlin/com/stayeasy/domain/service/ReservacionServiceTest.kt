package com.stayeasy.domain.service

import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.ports.ReservacionRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class ReservacionServiceTest {

    private val repository = mockk<ReservacionRepository>()
    private val service = ReservacionService(repository)

    @Test
    fun `deberia crear reserva si no hay solapamiento`() {
        val habitacionId = UUID.randomUUID()
        val inicio = LocalDateTime.now().plusDays(1)
        val fin = inicio.plusDays(2)
        
        val reserva = Reservacion(
            id = UUID.randomUUID(),
            huespedId = UUID.randomUUID(),
            habitacionId = habitacionId,
            fechaCheckIn = inicio,
            fechaCheckOut = fin,
            tarifaTotal = 200.0,
            estado = EstadoReservacion.CONFIRMADA
        )

        every { repository.buscarPorHabitacionYFechas(habitacionId, any(), any()) } returns emptyList()
        every { repository.guardar(any()) } returns reserva

        val resultado = service.crearReservacion(reserva)

        assertNotNull(resultado)
        verify { repository.guardar(reserva) }
    }

    @Test
    fun `deberia lanzar excepcion si hay solapamiento`() {
        val habitacionId = UUID.randomUUID()
        val inicio = LocalDateTime.now().plusDays(1)
        val fin = inicio.plusDays(2)

        val reservaExistente = mockk<Reservacion>()
        val nuevaReserva = Reservacion(
            id = UUID.randomUUID(),
            huespedId = UUID.randomUUID(),
            habitacionId = habitacionId,
            fechaCheckIn = inicio,
            fechaCheckOut = fin,
            tarifaTotal = 200.0,
            estado = EstadoReservacion.CONFIRMADA
        )

        every { repository.buscarPorHabitacionYFechas(habitacionId, any(), any()) } returns listOf(reservaExistente)

        assertThrows(IllegalStateException::class.java) {
            service.crearReservacion(nuevaReserva)
        }
    }

    @Test
    fun `deberia cancelar reserva`() {
        val id = UUID.randomUUID()
        every { repository.cancelar(id) } returns Unit

        service.cancelarReservacion(id)

        verify { repository.cancelar(id) }
    }
}
