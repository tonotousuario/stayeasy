package com.stayeasy.domain.model

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

class HuespedTest {

    @Test
    fun `deberia crear huesped con datos validos`() {
        val id = UUID.randomUUID()
        val huesped = Huesped(
            id = id,
            nombre = "Juan Perez",
            email = "juan.perez@example.com",
            identificacion = "INE123456"
        )

        assertEquals(id, huesped.id)
        assertEquals("Juan Perez", huesped.nombre)
        assertEquals("juan.perez@example.com", huesped.email)
        assertEquals("INE123456", huesped.identificacion)
    }

    @Test
    fun `deberia lanzar excepcion si el email es invalido`() {
        assertThrows(IllegalArgumentException::class.java) {
            Huesped(
                id = UUID.randomUUID(),
                nombre = "Juan Perez",
                email = "correo-invalido",
                identificacion = "INE123456"
            )
        }
    }

    @Test
    fun `deberia lanzar excepcion si el nombre esta vacio`() {
        assertThrows(IllegalArgumentException::class.java) {
            Huesped(
                id = UUID.randomUUID(),
                nombre = "",
                email = "juan@example.com",
                identificacion = "INE123456"
            )
        }
    }
}
