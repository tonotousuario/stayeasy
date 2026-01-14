package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.EstadoHabitacion
import com.stayeasy.domain.model.Habitacion
import com.stayeasy.domain.ports.HabitacionRepository
import com.stayeasy.infrastructure.persistence.Habitaciones
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

class PostgresHabitacionRepository : HabitacionRepository {

    override fun buscarPorId(id: UUID): Habitacion? {
        return transaction {
            Habitaciones.selectAll().where { Habitaciones.id eq id }
                .map { toHabitacion(it) }
                .singleOrNull()
        }
    }

    override fun obtenerTodas(): List<Habitacion> {
        return transaction {
            Habitaciones.selectAll().map { toHabitacion(it) }
        }
    }

    override fun actualizarEstado(id: UUID, nuevoEstado: EstadoHabitacion) {
        transaction {
            Habitaciones.update({ Habitaciones.id eq id }) {
                it[estado] = nuevoEstado.name
            }
        }
    }

    private fun toHabitacion(row: ResultRow): Habitacion {
        return Habitacion(
            id = row[Habitaciones.id],
            numero = row[Habitaciones.numero],
            tipoId = row[Habitaciones.tipoId],
            estado = EstadoHabitacion.valueOf(row[Habitaciones.estado]),
            descripcion = row[Habitaciones.descripcion]
        )
    }
}
