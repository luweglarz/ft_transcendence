# Prisma in a nutshell

We use prisma as our ORM to handle our postres database queries.

## Schema (declaring tables)

Prisma lets us define our data sources and tables in `src/prisma/schema.prisma`.

More info: [official documentation - concepts: schema](https://www.prisma.io/docs/concepts/components/prisma-schema)

### Models

The main schema's declarations we will use is: `model`. It allows us to generate our tables.

Example with a most basic model:
```prisma
model User {
  id       Int    @id @default(autoincrement())
  username String
}
```

This will declare a new table with two **fields**: `id` and `username`.

We also have to declare the **field type** (`Int`, `String`) and optionalyy pass more info about our database with **attributes** (`@id`, `@default` etc.).

More info: [reference: fields](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-fields)

#### Field type

The type of each variable is mandatory, it is the second element of a column declaration. Here `username` is declared to be an `String` (for info, in a postgres database it will then be implemented as of type `TEXT`).

Basic types are `Int`, `String`, `Boolean`, etc. Note that we can also create more complex types.

More info: [reference: field types](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)

#### Attributes

In our example we used two attributes to add information on the field `id`:
- `@id`: tells that it can be used as the identifier of a row
- `@default`: tells how to populate the field if no value is provided when adding a new entry (here we use a builtin prisma function `autoincrement()`)

There are many more attributes available.

More info: [reference: attributes](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#model-field-scalar-types)

#### Apply schema modifications

To apply modifications to our database, we use the CLI `prisma` (provided by the npm package `prisma`, installed as a dev dependency).

- for temporary changes: `npx prisma db push`
- for definitive changes (before a commit): `npx prisma migrate dev`

Note that the environment data to run these commands are only available in our docker-compose backend container (for now at least). Hence to run these commands we can run the following scripts:

- for temporary changes: `npm run prisma:push`
- for definitive changes (before a commit): `npm run prisma:migrate`

## Typescript client
