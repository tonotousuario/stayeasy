package com.stayeasy.infrastructure.persistence

import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.javatime.datetime

object Huespedes : Table("huesped") {
    val id = uuid("id_huesped")
    val nombre = varchar("nombre", 100)
    val apellido = varchar("apellido", 100)
    val email = varchar("email", 150).uniqueIndex()
    val telefono = varchar("telefono", 20).nullable()
    val identificacion = varchar("identificacion", 50).uniqueIndex()

    override val primaryKey = PrimaryKey(id)
}

object TiposHabitacion : Table("tipo_habitacion") {
    val id = uuid("id_tipo_habitacion")
    val nombre = varchar("nombre", 50)
    val capacidadMaxima = integer("capacidad_maxima")
    val tarifaBase = decimal("tarifa_base", 10, 2)

    override val primaryKey = PrimaryKey(id)
}

object Habitaciones : Table("habitacion") {
    val id = uuid("id_habitacion")
    val numero = integer("numero").uniqueIndex()
    val tipoId = uuid("id_tipo_habitacion").references(TiposHabitacion.id)
    val estado = varchar("estado", 20) // LIMPIA, SUCIA, MANTENIMIENTO, OCUPADA
    val descripcion = text("descripcion").nullable()

    override val primaryKey = PrimaryKey(id)
}

object Reservaciones : Table("reservacion") {
    val id = uuid("id_reservacion")
    val huespedId = uuid("id_huesped").references(Huespedes.id)
    val habitacionId = uuid("id_habitacion").references(Habitaciones.id)
    val fechaCheckIn = datetime("fecha_check_in")
    val fechaCheckOut = datetime("fecha_check_out")
    val numAdultos = integer("num_adultos").default(1)
    val tarifaTotal = decimal("tarifa_total", 10, 2)
    val estado = varchar("estado", 30) // CONFIRMADA, CHECK_IN, CANCELADA
    val fechaCreacion = datetime("fecha_creacion")

    override val primaryKey = PrimaryKey(id)
}

object Users : Table("system_user") {
    val id = uuid("id_user")
    val username = varchar("username", 100).uniqueIndex()
    val hashedPassword = varchar("hashed_password", 255)
    val role = varchar("role", 50) // ADMIN, RECEPTIONIST

    override val primaryKey = PrimaryKey(id)
}

