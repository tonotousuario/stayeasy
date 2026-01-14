package com.stayeasy.domain.model

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class ReservacionTest {

    @Test
    fun `deberia calcular la estancia correctamente`() {
        val checkIn = LocalDateTime.now()
        val checkOut = checkIn.plusDays(3)
        
        val reservacion = Reservacion(
            id = UUID.randomUUID(),
            huespedId = UUID.randomUUID(),
            habitacionId = UUID.randomUUID(),
            fechaCheckIn = checkIn,
            fechaCheckOut = checkOut,
            tarifaTotal = 300.0,
            estado = EstadoReservacion.CONFIRMADA
        )

        assertEquals(3, reservacion.duracionEstanciaDias())
    }

    @Test
    fun `deberia lanzar excepcion si check-out es anterior a check-in`() {
        val checkIn = LocalDateTime.now()
        val checkOut = checkIn.minusDays(1)

        assertThrows(IllegalArgumentException::class.java) {
            Reservacion(
                id = UUID.randomUUID(),
                huespedId = UUID.randomUUID(),
                habitacionId = UUID.randomUUID(),
                fechaCheckIn = checkIn,
                fechaCheckOut = checkOut,
                tarifaTotal = 100.0,
                estado = EstadoReservacion.CONFIRMADA
            )
        }
    }
}
