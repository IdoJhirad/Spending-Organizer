using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace c__api.Migrations
{
    /// <inheritdoc />
    public partial class Setnull2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "83148134-2279-4b53-a725-d3c87937ee19");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e60ca6ac-186e-43ab-a1c0-fb28225985ff");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "287bc4de-90f6-48d3-92f9-921052151926", null, "Admin", "ADMIN" },
                    { "902d70f2-41ce-44e8-94b4-ede35d4ba66e", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "287bc4de-90f6-48d3-92f9-921052151926");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "902d70f2-41ce-44e8-94b4-ede35d4ba66e");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "83148134-2279-4b53-a725-d3c87937ee19", null, "Admin", "ADMIN" },
                    { "e60ca6ac-186e-43ab-a1c0-fb28225985ff", null, "User", "USER" }
                });
        }
    }
}
