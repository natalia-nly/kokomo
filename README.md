# KOKOMO 🌴

# **Developers:**

Natalia López / Claudi Sánchez

# **Link to App:**

TBD

- Mobile first

## **Description**

Facilitar la reserva en locales con aforo limitado

MVP → chiringuitos

## **User Stories**

- **[EPIC]** CRUD owners
- **[EPIC]** CRUD customers
- **[EPIC]** CRUD de chiringuitos
- **[EPIC]** CRUD de Reservas
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - Como usuario quiero ver una homepage que me de información sobre los chiringuitos disponibles y qué puedo hacer con la app (landing page)
- **sign up customer** - Como customer quiero poder registrarme para reservar mesas en los chiringuitos
- **sign up owner** - Como owner quiero poder registar mis locales para gestionar las reservas a través de la aplicción.
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **lista de locales** - Como customer quiero poder ver todos los locales disponibles para poder elegir el que más me convenga.
- **Crear reserva** - Como customer quiero poder hacer una reserva indicando día, hora y cuántas personas seremos
- **Gestión de las reservas (Cliente)** - Como cliente quiero poder ver y gestionar mis reservas.
- **Crear locales** - Como propietario quiero poder crear y gestionar mis locales
- **Gestión de las reservas (Propietario)** - Como propietario quiero poder ver y gestionar las reservas en mis locales.

## **Backlog**

List of other features outside of the MVPs scope

User profile:

- see my profile
- upload my pictures and my description
- see other users profile
- search filters
- add friends to the event

Geo Location:

- add geolocation to events when creating
- show event in a map in event detail page
- show all events in a map in the event list page

## **ROUTES:**

| Method | URL                    | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | /locals                | Listado de todos los locales  |
| GET    | /locals/availabilities | Disponibilidad de los locales |
| GET    | /local                 | Vista de un local             |
| GET    | /local/availability    | Disponibilidad de un local    |
| POST   | /local/booking         | Reservar en un local          |



## **Models**

```jsx
CUSTOMER
- username: String
- passwordHash: String
- reservas [REF Reservas]
- email: String

```

```jsx
PROPERTY
- name: String
- descriptions: [
    language: String,
    description: String
]
- categories: [tags: String]
- media: [images]
- location: {
    Nombre: String,
    Lat: Number
    Long: Number
}
- opening_hours:[{
    opening_days:{
 opening_day: Date
    closing_day: Date
    },
    week_days:[String],
    opening_times:[
        {
            opening_time: Date,
            closing_time: Date
        }
    ]
}]
- booking_time: Number
- available_places: number
- comments: [{
    username: String,
    day: Date,
    comment: String
}]
- rating: Number
- Schedule: [REF Schedule]
- Bookings: [REF bookings]
```

```jsx
BOOKINGS
- User [REF User]
- Property 
- Hour
- Day
- People: Number

```

```jsx
SCHEDULE

const schedule =  {
	property: [REF property],
	timeBoxes: [{
		start_time: Date,
		end_time: Date,
		status:Boolean,
		remaining: Number, 
		total:Number
	}]
}
 
```



## Links

### Git

The url to your repository and to your deployed project

[Repository Link] (https://github.com/natalia-nly/kokomo)

[Deploy Link] ('https://')

### Slides

The url to your presentation slides

[Slides Link](http://slides.com)