package com.stayeasy.domain.model

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class HabitacionTest {

    @Test
    fun `deberia crear habitacion con estado LIMPIA`() {
        val id = UUID.randomUUID()
        val tipoId = UUID.randomUUID()
        val habitacion = Habitacion(
            id = id,
            numero = 101,
            tipoId = tipoId,
            estado = EstadoHabitacion.LIMPIA
        )

        assertEquals(id, habitacion.id)
        assertEquals(101, habitacion.numero)
        assertEquals(EstadoHabitacion.LIMPIA, habitacion.estado)
    }
}
