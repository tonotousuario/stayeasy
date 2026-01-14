package com.stayeasy.infrastructure.adapters

import com.stayeasy.domain.model.Huesped
import com.stayeasy.domain.ports.HuespedRepository
import com.stayeasy.infrastructure.persistence.Huespedes
import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
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
