package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.Huesped
import com.stayeasy.domain.ports.HuespedRepository
import com.stayeasy.infrastructure.persistence.Huespedes
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq // Explicit import for 'eq'
import org.jetbrains.exposed.sql.transactions.transaction
import java.util.UUID

class PostgresHuespedRepository : HuespedRepository {

    override fun buscarPorId(id: UUID): Huesped? {
        return transaction {
            Huespedes.selectAll().where { Huespedes.id eq id }
                .map { toHuesped(it) }
                .singleOrNull()
        }
    }

    override fun obtenerTodos(): List<Huesped> {
        return transaction {
            Huespedes.selectAll().map { toHuesped(it) }
        }
    }

    override fun save(huesped: Huesped): Huesped {
        transaction {
            val existingHuesped = Huespedes.selectAll().where { Huespedes.id eq huesped.id }.singleOrNull()
            if (existingHuesped == null) {
                Huespedes.insert {
                    it[id] = huesped.id
                    it[nombre] = huesped.nombre
                    it[apellido] = huesped.apellido
                    it[email] = huesped.email
                    it[identificacion] = huesped.identificacion
                }
            } else {
                Huespedes.update({ Huespedes.id eq huesped.id }) {
                    it[nombre] = huesped.nombre
                    it[apellido] = huesped.apellido
                    it[email] = huesped.email
                    it[identificacion] = huesped.identificacion
                }
            }
        }
        return huesped
    }

    override fun delete(id: UUID): Boolean {
        return transaction {
            Huespedes.deleteWhere { Huespedes.id eq id } > 0
        }
    }

    private fun toHuesped(row: ResultRow): Huesped {
        return Huesped(
            id = row[Huespedes.id],
            nombre = row[Huespedes.nombre],
            apellido = row[Huespedes.apellido], // Asegurando que leemos el apellido
            email = row[Huespedes.email],
            identificacion = row[Huespedes.identificacion]
        )
    }
}
