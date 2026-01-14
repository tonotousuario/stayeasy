package com.stayeasy.domain.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import java.util.UUID

class DomainModelGettersTest {

    @Test
    fun `test habitacion getters`() {
        val id = UUID.randomUUID()
        val tipoId = UUID.randomUUID()
        val habitacion = Habitacion(id, 1, tipoId, EstadoHabitacion.LIMPIA, "Desc")
        
        assertEquals(id, habitacion.id)
        assertEquals(1, habitacion.numero)
        assertEquals(tipoId, habitacion.tipoId)
        assertEquals(EstadoHabitacion.LIMPIA, habitacion.estado)
        assertEquals("Desc", habitacion.descripcion)
    }

    @Test
    fun `test reservacion getters`() {
        val id = UUID.randomUUID()
        val hId = UUID.randomUUID()
        val habId = UUID.randomUUID()
        val now = LocalDateTime.now()
        val res = Reservacion(id, hId, habId, now, now.plusDays(1), 100.0, EstadoReservacion.CONFIRMADA, 2, now)
        
        assertEquals(id, res.id)
        assertEquals(hId, res.huespedId)
        assertEquals(habId, res.habitacionId)
        assertEquals(now, res.fechaCheckIn)
        assertEquals(now.plusDays(1), res.fechaCheckOut)
        assertEquals(100.0, res.tarifaTotal)
        assertEquals(EstadoReservacion.CONFIRMADA, res.estado)
        assertEquals(2, res.numAdultos)
        assertEquals(now, res.fechaCreacion)
    }

    @Test
    fun `test huesped getters`() {
        val id = UUID.randomUUID()
        val h = Huesped(id, "Nombre", "test@test.com", "ID123")
        
        assertEquals(id, h.id)
        assertEquals("Nombre", h.nombre)
        assertEquals("test@test.com", h.email)
        assertEquals("ID123", h.identificacion)
    }

    @Test
    fun `test dtos getters`() {
        val req = com.stayeasy.infrastructure.api.dtos.ReservacionRequest("h", "hab", "2026-01-01", "2026-01-02", 1, 100.0)
        assertEquals("h", req.huespedId)
        assertEquals("hab", req.habitacionId)
        assertEquals("2026-01-01", req.fechaCheckIn)
        assertEquals("2026-01-02", req.fechaCheckOut)
        assertEquals(1, req.numAdultos)
        assertEquals(100.0, req.tarifaTotal)

        val res = com.stayeasy.infrastructure.api.dtos.ReservacionResponse("id", "h", "hab", "2026-01-01", "2026-01-02", "CONFIRMADA", 100.0)
        assertEquals("id", res.id)
        assertEquals("h", res.huespedId)
        assertEquals("hab", res.habitacionId)
        assertEquals("2026-01-01", res.fechaCheckIn)
        assertEquals("2026-01-02", res.fechaCheckOut)
        assertEquals("CONFIRMADA", res.estado)
        assertEquals(100.0, res.tarifaTotal)
    }

    @Test
    fun `test validations`() {
        val id = UUID.randomUUID()
        org.junit.jupiter.api.assertThrows<IllegalArgumentException> {
            Huesped(id, "", "a@b.com", "ID")
        }
        org.junit.jupiter.api.assertThrows<IllegalArgumentException> {
            Huesped(id, "N", "a@b.com", "")
        }
        org.junit.jupiter.api.assertThrows<IllegalArgumentException> {
            Reservacion(id, id, id, LocalDateTime.now(), LocalDateTime.now().plusDays(1), -1.0, EstadoReservacion.CONFIRMADA)
        }
    }

    @Test
    fun `test data class methods`() {
        val id = UUID.randomUUID()
        val h1 = Habitacion(id, 1, id, EstadoHabitacion.LIMPIA)
        val h2 = Habitacion(id, 1, id, EstadoHabitacion.LIMPIA)
        val h3 = h1.copy(numero = 2)
        
        assertEquals(h1, h2)
        assertEquals(h1.hashCode(), h2.hashCode())
        assertNotNull(h1.toString())
        assertEquals(2, h3.numero)

        val hu1 = Huesped(id, "N", "a@b.com", "ID")
        val hu2 = hu1.copy(nombre = "N2")
        assertEquals(hu1, hu1)
        assertNotNull(hu1.toString())
        assertNotNull(hu1.hashCode())
        assertEquals("N2", hu2.nombre)

        val now = LocalDateTime.now()
        val r1 = Reservacion(id, id, id, now, now.plusDays(1), 100.0, EstadoReservacion.CONFIRMADA)
        val r2 = r1.copy(tarifaTotal = 200.0)
        assertEquals(r1, r1)
        assertNotNull(r1.toString())
        assertNotNull(r1.hashCode())
        assertEquals(200.0, r2.tarifaTotal)

        val req1 = com.stayeasy.infrastructure.api.dtos.ReservacionRequest("h", "hab", "2026-01-01", "2026-01-02", 1, 100.0)
        val req2 = req1.copy(numAdultos = 5)
        assertEquals(req1, req1)
        assertNotNull(req1.toString())
        assertNotNull(req1.hashCode())
        assertEquals(5, req2.numAdultos)

        val res1 = com.stayeasy.infrastructure.api.dtos.ReservacionResponse("id", "h", "hab", "2026-01-01", "2026-01-02", "CONFIRMADA", 100.0)
        val res2 = res1.copy(estado = "CANCELADA")
        assertEquals(res1, res1)
        assertNotNull(res1.toString())
        assertNotNull(res1.hashCode())
        assertEquals("CANCELADA", res2.estado)
    }
}
