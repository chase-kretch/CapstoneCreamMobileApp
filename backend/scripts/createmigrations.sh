#!/bin/bash
echo Enter migration name:
read migrationName

dotnet ef migrations add "TemporaryMigration${migrationName}" --context CreamPostgresDbContext --output-dir Migrations/PostgresMigrations
dotnet ef migrations add "TemporaryMigration${migrationName}" --context CreamSqliteDbContext --output-dir Migrations/SqliteMigrations