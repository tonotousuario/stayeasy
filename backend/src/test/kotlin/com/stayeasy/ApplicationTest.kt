package com.stayeasy

import com.stayeasy.infrastructure.persistence.DatabaseFactory
import io.ktor.server.testing.*
import io.mockk.every
import io.mockk.mockkObject
import io.mockk.unmockkAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test

class ApplicationTest {

    @AfterEach
    fun tearDown() {
        unmockkAll()
    }

    @Test
    fun `test application module initialization`() = testApplication {
        mockkObject(DatabaseFactory)
        every { DatabaseFactory.init(any(), any(), any(), any()) } returns Unit
        
        application {
            module()
        }
    }
}