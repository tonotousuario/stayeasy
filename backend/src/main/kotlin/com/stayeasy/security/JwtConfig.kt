package com.stayeasy.security

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTVerifier
import com.auth0.jwt.algorithms.Algorithm
import com.stayeasy.domain.model.User
import java.util.*

object JwtConfig {
    private const val secret = "your-secret-key-change-it-in-production" // TODO: Use environment variable
    private const val issuer = "com.stayeasy"
    internal const val audience = "users"
    private const val expiration = 3_600_000 // 1 hour

    private val algorithm = Algorithm.HMAC256(secret)

    val verifier: JWTVerifier = JWT
        .require(algorithm)
        .withIssuer(issuer)
        .withAudience(audience)
        .build()

    fun generateToken(user: User): String = JWT.create()
        .withSubject("Authentication")
        .withIssuer(issuer)
        .withAudience(audience)
        .withClaim("userId", user.id.toString())
        .withClaim("username", user.username)
        .withClaim("role", user.role.name)
        .withExpiresAt(getExpiration())
        .sign(algorithm)

    private fun getExpiration() = Date(System.currentTimeMillis() + expiration)
}
