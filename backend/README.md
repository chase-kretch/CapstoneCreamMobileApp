# Database migrations

## Problem:

Migrations are quite a complicated process due to us having 2 databases, there are 2 sets of migrations. Additionally,
when using migrations in separate branches, the migrations cannot be merged together. This is because the migrations
are based on the current state of the database, so if database is in state 1 when migration A and B are created in
separate branches, then when the branches are merged, the migrations will both be based on state 1, but one actually
needs to be based on state 2. This is why we have to be careful when merging branches with migrations.

## Solution - Tempoarary:

Temporary migrations should be used when you are working on a feature branch and need to create a migration.
These migrations are not permanent and should not be committed to the repository. This prevents the problem above

```bash
dotnet tool install --global dotnet-ef # Install the ef tool if you haven't already
cd ./backend  # Change to the backend directory
chmod +x ./scripts/createmigrations.sh # Make the script executable
./scripts/createmigrations.sh # Run the script, will prompt for migration name, must be unique
```

The script will create migrations for both databases. The script prefixes the migration with a "Temporary" tag, so that
it is gitignored, however the DbContextModelSnapshot (the state) is not gitignored, so try to avoid comitting this file

## Solution - Permanent:

Permanent migrations are migrations that are created when a feature is complete and ready to be merged into the main branch.

1. Merge the feature to main branch
2. Run the migrations script
   1. https://github.com/uoa-compsci399-s2-2024/capstone-project-team-32/actions/workflows/create-migrations.yml
   2. Press "Run workflow" and select the main branch
   3. Enter the migration name, must be unique
   4. The script will create migrations for both databases, these will be permanent.

This works by using 2 separate folders, "GithubMigrations" and "Migrations". "GithubMigrations" is only modified by
github actions, and is the "source of truth" for the migrations. "Migrations" is the folder that the application uses
to apply migrations. The github actions script will copy the "source of truth" migrations from "GithubMigrations" to "Migrations",
execute the command to create new migrations, and then copy the new migrations back to "GithubMigrations" and commit them.

This way, the migrations are always based on the current state of the database, and the migrations can be merged together
without any issues.