package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.Habitacion
import com.stayeasy.infrastructure.persistence.Habitaciones
import com.stayeasy.infrastructure.persistence.TiposHabitacion
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import java.util.UUID

class PostgresHabitacionRepositoryTest {

    private val repository = PostgresHabitacionRepository()

    companion object {
        @JvmStatic
        @BeforeAll
        fun setup() {
            Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1", driver = "org.h2.Driver")
        }
    }

    @BeforeEach
    fun prepare() {
        transaction {
            SchemaUtils.create(TiposHabitacion, Habitaciones)
        }
    }

    @AfterEach
    fun tearDown() {
        transaction {
            SchemaUtils.drop(Habitaciones, TiposHabitacion)
        }
    }

    @Test
    fun `deberia buscar habitacion por id`() {
        val tipoId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()

        transaction {
            TiposHabitacion.insert {
                it[id] = tipoId
                it[nombre] = "Simple"
                it[capacidadMaxima] = 2
                it[tarifaBase] = 100.0.toBigDecimal()
            }
            Habitaciones.insert {
                it[id] = habitacionId
                it[numero] = 101
                it[this.tipoId] = tipoId
                it[estado] = "LIMPIA"
                it[descripcion] = "Vista al mar"
            }
        }

        val resultado = repository.buscarPorId(habitacionId)

        assertNotNull(resultado)
        assertEquals(101, resultado?.numero)
        assertEquals(EstadoHabitacion.LIMPIA, resultado?.estado)
    }

    @Test
    fun `deberia retornar null si no existe habitacion`() {
        val resultado = repository.buscarPorId(UUID.randomUUID())
        assertNull(resultado)
    }

    @Test
    fun `deberia obtener todas las habitaciones`() {
        val tipoId = UUID.randomUUID()
        transaction {
            TiposHabitacion.insert {
                it[id] = tipoId
                it[nombre] = "Doble"
                it[capacidadMaxima] = 4
                it[tarifaBase] = 200.0.toBigDecimal()
            }
            Habitaciones.insert {
                it[id] = UUID.randomUUID()
                it[numero] = 201
                it[this.tipoId] = tipoId
                it[estado] = "LIMPIA"
            }
            Habitaciones.insert {
                it[id] = UUID.randomUUID()
                it[numero] = 202
                it[this.tipoId] = tipoId
                it[estado] = "SUCIA"
            }
        }

        val todas = repository.obtenerTodas()
        assertEquals(2, todas.size)
    }

    @Test
    fun `deberia actualizar estado de habitacion`() {
        val tipoId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()

        transaction {
            TiposHabitacion.insert {
                it[id] = tipoId
                it[nombre] = "Suite"
                it[capacidadMaxima] = 2
                it[tarifaBase] = 300.0.toBigDecimal()
            }
            Habitaciones.insert {
                it[id] = habitacionId
                it[numero] = 301
                it[this.tipoId] = tipoId
                it[estado] = "LIMPIA"
            }
        }

        repository.actualizarEstado(habitacionId, EstadoHabitacion.OCUPADA)

        val actualizada = repository.buscarPorId(habitacionId)
        assertEquals(EstadoHabitacion.OCUPADA, actualizada?.estado)
    }
}
