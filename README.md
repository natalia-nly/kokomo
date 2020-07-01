
# KOKOMO 🌴


# Developers

Natalia López / Claudi Sánchez

# La aplicación

https://kokomo-app.herokuapp.com/

## Descripción

Facilitar la reserva en locales con aforo limitado

MVP → chiringuitos

## User Stories

[Notion Link](https://www.notion.so/1e08243224c842e29a9b44db892fec01?v=609e57e9cefd4931b2a8eead1ed3812b)

## Backlog

[Notion Link](https://www.notion.so/1e08243224c842e29a9b44db892fec01?v=609e57e9cefd4931b2a8eead1ed3812b)

## Rutas

- Index: Home page

- Auth: Gestión de las operaciones de autorización:
  - SignUp (owner/customer)
  - Login
  - Login Social (google)

- Profile: Gestión del perfil del usuario:
  - Ver perfil del usuario
  - Gestión del perfil:
      - Contraseña
      - Teléfono
      - Si tiene propiedades
  - Borrar el perfil

- Property: Creación, gestión y visualización de los locales
  - Creación del local y su inventario
  - Visualización de los detalles del local
  - Gestión del local:
    - Cambio de horarios
    - Cambio de imágnes
    - Cambio de localización
  - Registro del local a los favoritos de un usuario
  - Creación de comentarios sobre el local

- Search: Búsqueda de disponibilidad por:
  - Criterio general
  - Por local
  - Por categoría

- Booking: Creación y gestión de reservas:
  - Creación de la reserva con identificador, con reducción de inventario
  - Visualización del listado de bookings de un usuario
    - Próximas reservas
    - En el caso de usuario owner, también las reservas creadas en sus    locales
  - Cancelar la reserva

## Models

- CUSTOMER: Usuario que hace reservas y/o gestiona locales
- PROPERTY: Local que puede ser reservado
- SCHEDULE: Horarios e inventario de un Local
- BOOKING: Reserva de un usario en un local con un horario determinado para un cierto número de personas

## Links

### Git

https://github.com/natalia-nly/kokomo

### Deploy

https://kokomo-app.herokuapp.com/

### Slides

[Slides Link](https://docs.google.com/presentation/d/15pwYUfc9VPzKb5lWr8LY_eL-FVJe7FZCJcyBCHLdo50/edit?usp=sharing)