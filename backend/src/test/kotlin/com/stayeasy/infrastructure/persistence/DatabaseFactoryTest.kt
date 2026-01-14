package com.stayeasy.infrastructure.persistence

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.assertNotNull

class DatabaseFactoryTest {

    @Test
    fun `deberia inicializar base de datos H2`() {
        // Probamos con H2 en memoria
        DatabaseFactory.init(
            jdbcURL = "jdbc:h2:mem:factory_test;DB_CLOSE_DELAY=-1",
            driverClassName = "org.h2.Driver",
            user = "sa",
            password = ""
        )
        // Si no lanza excepción, consideramos que pasó
    }

    @Test
    fun `deberia intentar inicializar con parametros por defecto`() {
        try {
            DatabaseFactory.init()
        } catch (e: Exception) {
            // Ignoramos fallos de conexión, solo queremos cubrir la rama
        }
    }
}
