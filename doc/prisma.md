# Prisma in a nutshell

We use prisma as our ORM to handle our postres database queries.

## CLI and typescript linting

We have various commands available from the commandline:

- `npx prisma generate`: will set up the "artifacts" in the node modules, which will for example be used by the linter (also by our scripts). You should try to run this command in the first place if you have any issue with prisma (and maybe rebuild the project if that still does not work).

- `npx prisma db push`: push temporary changes to the database

- `npx prisma migrate dev`: push definitive changes to the database (record the changes in `backend/prisma/migrations`)

More info: [official documentation - reference: CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

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

More info: [reference: cli](https://www.prisma.io/docs/reference/api-reference/command-reference)

## Typescript client

Now that our dabase is properly setup, we want to run queries from our backend code.
For that we will need a client (provided by the npm dependency `@prisma/client`).

Examples, based on the simple model above, where `service` is an instance of `PrismaClient`.

### Create a user:

```ts
await service.user.create({
  data: {
    username: 'Agent Smith',
  },
});
```

### Find a user:

```ts
const user = await service.user.findFirst({
  where: { id: 1 },
});
```

### How we will invoke the client in practice

Just inject the service `DbService` (that extends the `PrismaClient` class) to your module and use it as a db client directly from your module.
