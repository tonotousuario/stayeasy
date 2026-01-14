package com.stayeasy.infrastructure.persistence

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.EstadoReservacion
import org.jetbrains.exposed.sql.deleteAll
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.util.UUID

object DataSeeder {
    fun seed() {
        transaction {
            // Habilitar la extensión para búsquedas insensibles a acentos
            exec("CREATE EXTENSION IF NOT EXISTS unaccent;")

            // Solo insertar si no hay huéspedes (asumimos DB vacía)
            if (Huespedes.selectAll().count() == 0L) {
                println("🌱 Sembrando datos de prueba...")

                // 1. Tipos de Habitación
                val tipoSimpleId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a01")
                val tipoDobleId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a02")
                val tipoSuiteId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a03")

                TiposHabitacion.insert {
                    it[id] = tipoSimpleId
                    it[nombre] = "Simple"
                    it[capacidadMaxima] = 1
                    it[tarifaBase] = 50.0.toBigDecimal()
                }
                TiposHabitacion.insert {
                    it[id] = tipoDobleId
                    it[nombre] = "Doble"
                    it[capacidadMaxima] = 2
                    it[tarifaBase] = 80.0.toBigDecimal()
                }
                TiposHabitacion.insert {
                    it[id] = tipoSuiteId
                    it[nombre] = "Suite"
                    it[capacidadMaxima] = 4
                    it[tarifaBase] = 150.0.toBigDecimal()
                }

                // 2. Habitaciones
                val habitacionesData = listOf(
                    Triple(101, tipoSimpleId, "Vista al jardín"),
                    Triple(102, tipoSimpleId, "Cerca del lobby"),
                    Triple(103, tipoDobleId, "Vista parcial mar"),
                    Triple(104, tipoDobleId, "Balcón amplio"),
                    Triple(201, tipoSuiteId, "Penthouse Jr"),
                    Triple(202, tipoSuiteId, "Jacuzzi incluido")
                )

                val habitacionIds = mutableListOf<UUID>()

                habitacionesData.forEach { (num, tipo, desc) ->
                    val newId = UUID.randomUUID()
                    habitacionIds.add(newId)
                    Habitaciones.insert {
                        it[id] = newId
                        it[numero] = num
                        it[tipoId] = tipo
                        it[estado] = EstadoHabitacion.LIMPIA.name
                        it[descripcion] = desc
                    }
                }

                // 3. Huéspedes
                val huespedId1 = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
                val huespedId2 = UUID.randomUUID()

                Huespedes.insert {
                    it[id] = huespedId1
                    it[nombre] = "Juan"
                    it[apellido] = "Pérez"
                    it[email] = "juan.perez@test.com"
                    it[identificacion] = "INE123456"
                }
                Huespedes.insert {
                    it[id] = huespedId2
                    it[nombre] = "Maria"
                    it[apellido] = "López"
                    it[email] = "maria.lopez@test.com"
                    it[identificacion] = "Pp987654"
                }

                // 4. Reservas de prueba (para ver algo en el calendario)
                // Reserva para la habitación 101, empezando mañana, por 3 días
                Reservaciones.insert {
                    it[id] = UUID.randomUUID()
                    it[huespedId] = huespedId1
                    it[habitacionId] = habitacionIds[0] // 101
                    it[fechaCheckIn] = LocalDateTime.now().plusDays(1)
                    it[fechaCheckOut] = LocalDateTime.now().plusDays(4)
                    it[numAdultos] = 1
                    it[tarifaTotal] = 150.0.toBigDecimal()
                    it[estado] = EstadoReservacion.CONFIRMADA.name
                    it[fechaCreacion] = LocalDateTime.now()
                }

                println("✅ Datos de prueba insertados correctamente.")
            } else {
                println("ℹ️ La base de datos ya tiene datos, saltando seed.")
            }
        }
    }
}
