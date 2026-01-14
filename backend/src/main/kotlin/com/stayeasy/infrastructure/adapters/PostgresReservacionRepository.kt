package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.EstadoReservacion
import com.stayeasy.domain.model.Reservacion
import com.stayeasy.domain.ports.ReservacionRepository
import com.stayeasy.infrastructure.persistence.Huespedes
import com.stayeasy.infrastructure.persistence.Reservaciones
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDateTime
import java.util.UUID

class PostgresReservacionRepository : ReservacionRepository {

    override fun guardar(reservacion: Reservacion): Reservacion {
        transaction {
            Reservaciones.insert {
                it[id] = reservacion.id
                it[huespedId] = reservacion.huespedId
                it[habitacionId] = reservacion.habitacionId
                it[fechaCheckIn] = reservacion.fechaCheckIn
                it[fechaCheckOut] = reservacion.fechaCheckOut
                it[numAdultos] = reservacion.numAdultos
                it[tarifaTotal] = reservacion.tarifaTotal.toBigDecimal()
                it[estado] = reservacion.estado.name
                it[fechaCreacion] = reservacion.fechaCreacion
            }
        }
        return reservacion
    }

    override fun buscarPorId(id: UUID): Reservacion? {
        return transaction {
            Reservaciones.selectAll().where { Reservaciones.id eq id }
                .map { toReservacion(it) }
                .singleOrNull()
        }
    }

    override fun buscarPorHabitacionYFechas(habitacionId: UUID, inicio: LocalDateTime, fin: LocalDateTime): List<Reservacion> {
        return transaction {
            Reservaciones.selectAll().where {
                (Reservaciones.habitacionId eq habitacionId) and
                (Reservaciones.estado neq EstadoReservacion.CANCELADA.name) and
                ((Reservaciones.fechaCheckIn less fin) and (Reservaciones.fechaCheckOut greater inicio))
            }.map { toReservacion(it) }
        }
    }

    override fun obtenerTodas(): List<Reservacion> {
        return transaction {
            Reservaciones.selectAll().map { toReservacion(it) }
        }
    }

    override fun buscar(query: String): List<Reservacion> {
        return transaction {
            val lowerCaseQuery = query.lowercase()
            val isUUID = runCatching { UUID.fromString(query) }.getOrNull()

            Reservaciones.join(Huespedes, JoinType.INNER, onColumn = Reservaciones.huespedId, otherColumn = Huespedes.id)
                .selectAll()
                .where {
                    if (isUUID != null) {
                        Reservaciones.id eq isUUID
                    } else {
                        Huespedes.apellido.lowerCase() like "%$lowerCaseQuery%"
                    }
                }
                .map { toReservacion(it) }
        }
    }

    override fun actualizarEstado(id: UUID, nuevoEstado: EstadoReservacion) {
        transaction {
            Reservaciones.update({ Reservaciones.id eq id }) {
                it[estado] = nuevoEstado.name
            }
        }
    }

    override fun cancelar(id: UUID) {
        transaction {
            Reservaciones.update({ Reservaciones.id eq id }) {
                it[estado] = EstadoReservacion.CANCELADA.name
            }
        }
    }

    private fun toReservacion(row: ResultRow): Reservacion {
        return Reservacion(
            id = row[Reservaciones.id],
            huespedId = row[Reservaciones.huespedId],
            habitacionId = row[Reservaciones.habitacionId],
            fechaCheckIn = row[Reservaciones.fechaCheckIn],
            fechaCheckOut = row[Reservaciones.fechaCheckOut],
            tarifaTotal = row[Reservaciones.tarifaTotal].toDouble(),
            estado = EstadoReservacion.valueOf(row[Reservaciones.estado]),
            numAdultos = row[Reservaciones.numAdultos],
            fechaCreacion = row[Reservaciones.fechaCreacion]
        )
    }
}
