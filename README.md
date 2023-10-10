## Setup

first, clone the repo:

```sh
git clone https://github.com/rodrigocitadin/restaurant-api
```

## System resume

- you can create an account to reserve some tables for a dinner
- you can only reserve a table if the time is **between 6:00 pm and 11:59 pm**, and **not on a sunday**
- you cannot reserve the table if you have any other reservation at the same time
- we have 15 tables available in the system

## User

to create a user, you need to inform your name, email, and password. Email must be unique

**POST** `localhost:3000/user`

```json
{
    "name": "your name",
    "email": "your@email",
    "password": "5tr0ng!P4ssword"
}
```

to authenticate a user, you need to inform your email and password

**POST** `localhost:3000/auth/login`

```json
{
    "username": "your@email",
    "password": "5tr0ng!P4ssword"
}
```

## Reservation

to create a reservation, you need to be logged and inform your id, table id, and the date

**POST** `localhost:3000/reservation`

```json
{
    "user_id": "484d6bdb-ef23-4ba6-ba23-69eb63e87025",
    "table_id": "1",
    "date": "2023/09/23, 19:31:40"
}
```

