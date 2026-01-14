package com.stayeasy.infrastructure.api

import com.stayeasy.domain.model.UserRole
import com.stayeasy.domain.service.UserService
import com.stayeasy.infrastructure.api.dtos.LoginRequest
import com.stayeasy.infrastructure.api.dtos.LoginResponse
import com.stayeasy.infrastructure.api.dtos.RegisterRequest
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.authRoutes(userService: UserService) {
    route("/api/v1/auth") {
        post("/register") {
            val request = call.receive<RegisterRequest>()
            try {
                // Ensure role is valid
                val role = UserRole.valueOf(request.role.uppercase())
                userService.registerUser(request.username, request.password, role)
                call.respond(HttpStatusCode.Created, mapOf("message" to "User registered successfully"))
            } catch (e: IllegalArgumentException) {
                call.respond(HttpStatusCode.BadRequest, mapOf("error" to (e.message ?: "Invalid registration data")))
            } catch (e: Exception) {
                call.respond(HttpStatusCode.Conflict, mapOf("error" to (e.message ?: "Could not register user")))
            }
        }

        post("/login") {
            val request = call.receive<LoginRequest>()
            val token = userService.loginUser(request.username, request.password)
            if (token != null) {
                call.respond(HttpStatusCode.OK, LoginResponse(token))
            } else {
                call.respond(HttpStatusCode.Unauthorized, mapOf("error" to "Invalid credentials"))
            }
        }
    }
}
