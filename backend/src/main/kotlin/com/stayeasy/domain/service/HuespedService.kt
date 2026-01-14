package com.stayeasy.domain.service

import com.stayeasy.domain.model.Huesped
import com.stayeasy.domain.ports.HuespedRepository

class HuespedService(private val repository: HuespedRepository) {
    fun obtenerTodos(): List<Huesped> = repository.obtenerTodos()
}
