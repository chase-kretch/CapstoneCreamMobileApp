using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.PostgresMigrations
{
    /// <inheritdoc />
    public partial class PermanentMigrationAddPreferenceFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "GenderExpressionPreferences",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "GenderExpression",
                table: "Users",
                newName: "MinAge");

            migrationBuilder.AddColumn<int>(
                name: "MaxAge",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "MaxDistanceKilometers",
                table: "Users",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Photos",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Key",
                table: "Photos",
                type: "character varying(36)",
                maxLength: 36,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "MaxAge",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "MaxDistanceKilometers",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Key",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "MinAge",
                table: "Users",
                newName: "GenderExpression");

            migrationBuilder.AddColumn<int[]>(
                name: "GenderExpressionPreferences",
                table: "Users",
                type: "integer[]",
                nullable: false,
                defaultValue: new int[0]);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Photos",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Photos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
