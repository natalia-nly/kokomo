[TOC]

# KOKOMO 🌴


# Developers

Natalia López / Claudi Sánchez

# La aplicación

https://kokomo-app.herokuapp.com/

## Descripción

Facilitar la reserva en locales con aforo limitado

MVP → chiringuitos

## User Stories

- [ ] **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- [ ] **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- [ ] **homepage** - Como usuario quiero ver una homepage que me de información sobre los chiringuitos disponibles y qué puedo hacer con la app (landing page)
- [x] **sign up customer** - Como customer quiero poder registrarme para reservar mesas en los chiringuitos
- [x] **sign up owner** - Como owner quiero poder registar mis locales para gestionar las reservas a través de la aplicción.
- [x] **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- [x] **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- [x] **lista de locales** - Como customer quiero poder ver todos los locales disponibles para poder elegir el que más me convenga.
- [x] **Crear reserva** - Como customer quiero poder hacer una reserva indicando día, hora y cuántas personas seremos
- [x] **Gestión de las reservas (Cliente)** - Como cliente quiero poder ver y gestionar mis reservas.
- [x] **Crear locales** - Como propietario quiero poder crear y gestionar mis locales
- [x] **Gestión de las reservas (Propietario)** - Como propietario quiero poder ver y gestionar las reservas en mis locales.

## Backlog

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

## Rutas

| Method | URL                    | Description                   |
| ------ | ---------------------- | ----------------------------- |
| GET    | /locals                | Listado de todos los locales  |
| GET    | /locals/availabilities | Disponibilidad de los locales |
| GET    | /local                 | Vista de un local             |
| GET    | /local/availability    | Disponibilidad de un local    |
| POST   | /local/booking         | Reservar en un local          |



## Models

```jsx
CUSTOMER
const customerSchema = new Schema({
      //Username del cliente
      username: {
        type: String,
        trim: true,
        required: [true, 'Username is required.'],
        unique: true
      },
      //Número de teléfono del cliente
      telNumber: {
        type: Number
      },
      //email del cliente
      email: {
        type: String,
        trim: true,
        required: [true, 'Email is required.'],
        unique: true
      }, 
      //GOOGLE Id
      googleID: String,
      //password del cliente
      passwordHash: {
        type: String
      },
      //avatar
      avatar: {
        type: String,
        default: "https://i.ya-webdesign.com/images/avatar-icon-png-5.png"
      },  
      //reservas del cliente
      bookings: [{type: Schema.Types.ObjectId, ref: "Booking"}],
      //favoritos
      favourites: [{type: Schema.Types.ObjectId, ref: "Property"}],
      // boolean para saber si es owner
      owner: {
        type: Boolean,
        default: false
      },
      // lista de sus locales
      ownProperties: [{type: Schema.Types.ObjectId, ref: "Property"}],
    },

        {
          timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
          }
        });

```

```jsx
PROPERTY
const propertySchema = new Schema({
    name: String,
    description: String,
    categories: {
        type: [String],
        enum: ['Chillout', 'Surfer', 'Restaurante', 'Discoteca', 'Bar']
    },
    mainImage: String,
    media: [String],
    location: {
        name: String,
        lat: Number,
        long: Number
    },
    openingHours: [{
         openingDays: {
             openingDay: Date,
            closingDay: Date
        },
       weekDays: [Number],
        openingTimes: [{
            openingTime: Number,
            closingTime: Number
        }]
    }],
    bookingDuration: Number,
    availablePlaces: Number,
    comments: [{
        username: String,
        day: Date,
        comment: String
    }],
    rating: Number,
    bookings: [{type: Schema.Types.ObjectId, ref: "Booking"}]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});
```

```jsx
BOOKINGS
const bookingSchema = new Schema({
    customer: {type: Schema.Types.ObjectId, ref: "Customer"},
    /*customerName: String,
    telNumber: Number,*/
    property: {type: Schema.Types.ObjectId, ref: "Property"},
    /*propertyName: String,*/
    bookingRef:String,
    day: String,
    time: String,
    timeBox: {type: Schema.Types.ObjectId},
    guests: Number
},
{
        timestamps: {
          createdAt: 'createdAt',
          updatedAt: 'updatedAt'
    }    
});

```

```jsx
SCHEDULE

const scheduleSchema = new Schema({
    property: {type: Schema.Types.ObjectId, ref: "Property"},
    timeBoxes: [{
        day: Date,
		startTime: String,
		endTime: Number,
		status: Boolean,
		remaining: Number,
        total: Number
	}]
},
{
    timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
    }    
});
 
```



## Links

### Git

https://github.com/natalia-nly/kokomo

### Deploy

https://kokomo-app.herokuapp.com/

### Slides

[Slides Link](http://slides.com)