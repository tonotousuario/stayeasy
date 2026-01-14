package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.infrastructure.persistence.Huespedes
import com.stayeasy.infrastructure.persistence.Habitaciones
import com.stayeasy.infrastructure.persistence.Reservaciones
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
import java.time.LocalDateTime
import java.util.UUID

class PostgresReservacionRepositoryTest {

    private val repository = PostgresReservacionRepository()

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
            SchemaUtils.create(Huespedes, TiposHabitacion, Habitaciones, Reservaciones)
        }
    }

    @AfterEach
    fun tearDown() {
        transaction {
            SchemaUtils.drop(Reservaciones, Habitaciones, TiposHabitacion, Huespedes)
        }
    }

    @Test
    fun `deberia guardar reservacion`() {
        val huespedId = UUID.randomUUID()
        val tipoId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()
        val reservacionId = UUID.randomUUID()

        insertarDatosBase(huespedId, tipoId, habitacionId)

        val reservacion = Reservacion(
            id = reservacionId,
            huespedId = huespedId,
            habitacionId = habitacionId,
            fechaCheckIn = LocalDateTime.now().plusDays(1),
            fechaCheckOut = LocalDateTime.now().plusDays(3),
            tarifaTotal = 500.0,
            estado = EstadoReservacion.CONFIRMADA
        )

        repository.guardar(reservacion)

        val guardada = repository.buscarPorId(reservacionId)
        assertNotNull(guardada)
        assertEquals(500.0, guardada?.tarifaTotal)
    }

    @Test
    fun `deberia buscar por habitacion y fechas`() {
        val huespedId = UUID.randomUUID()
        val tipoId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()
        val reservacionId = UUID.randomUUID()
        val inicio = LocalDateTime.now().plusDays(10)
        val fin = inicio.plusDays(5)

        insertarDatosBase(huespedId, tipoId, habitacionId)

        val reservacion = Reservacion(
            id = reservacionId,
            huespedId = huespedId,
            habitacionId = habitacionId,
            fechaCheckIn = inicio,
            fechaCheckOut = fin,
            tarifaTotal = 1000.0,
            estado = EstadoReservacion.CONFIRMADA
        )
        repository.guardar(reservacion)

        // Solapamiento total
        val encontradas = repository.buscarPorHabitacionYFechas(habitacionId, inicio.minusDays(1), fin.plusDays(1))
        assertEquals(1, encontradas.size)

        // Sin solapamiento
        val vacias = repository.buscarPorHabitacionYFechas(habitacionId, inicio.minusDays(10), inicio.minusDays(1))
        assertTrue(vacias.isEmpty())
    }

    @Test
    fun `deberia cancelar reservacion`() {
        val huespedId = UUID.randomUUID()
        val tipoId = UUID.randomUUID()
        val habitacionId = UUID.randomUUID()
        val reservacionId = UUID.randomUUID()

        insertarDatosBase(huespedId, tipoId, habitacionId)

        val reservacion = Reservacion(
            id = reservacionId,
            huespedId = huespedId,
            habitacionId = habitacionId,
            fechaCheckIn = LocalDateTime.now(),
            fechaCheckOut = LocalDateTime.now().plusDays(1),
            tarifaTotal = 150.0,
            estado = EstadoReservacion.CONFIRMADA
        )
        repository.guardar(reservacion)

        repository.cancelar(reservacionId)

        val cancelada = repository.buscarPorId(reservacionId)
        assertEquals(EstadoReservacion.CANCELADA, cancelada?.estado)
    }

    private fun insertarDatosBase(huespedId: UUID, tipoId: UUID, habitacionId: UUID) {
        transaction {
            Huespedes.insert {
                it[id] = huespedId
                it[nombre] = "Test"
                it[apellido] = "User"
                it[email] = "test@example.com"
                it[identificacion] = "DOC123"
            }
            TiposHabitacion.insert {
                it[id] = tipoId
                it[nombre] = "Standard"
                it[capacidadMaxima] = 2
                it[tarifaBase] = 100.0.toBigDecimal()
            }
            Habitaciones.insert {
                it[id] = habitacionId
                it[numero] = 101
                it[this.tipoId] = tipoId
                it[estado] = "LIMPIA"
            }
        }
    }
}
