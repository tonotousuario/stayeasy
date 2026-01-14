package com.stayeasy.domain.ports

import com.stayeasy.domain.model.Huesped
import java.util.UUID

interface HuespedRepository {
    fun buscarPorId(id: UUID): Huesped?
    fun obtenerTodos(): List<Huesped>
    fun save(huesped: Huesped): Huesped
    fun delete(id: UUID): Boolean
}
