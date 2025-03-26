using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace c__api.Migrations
{
    /// <inheritdoc />
    public partial class SetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_Categories_CategoryModelId",
                table: "Expenses");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "144fa4db-ffd9-4da8-aaf6-3ebc65427912");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5b4a557c-8d3b-4060-88ce-bba440ea4453");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "83148134-2279-4b53-a725-d3c87937ee19", null, "Admin", "ADMIN" },
                    { "e60ca6ac-186e-43ab-a1c0-fb28225985ff", null, "User", "USER" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_Categories_CategoryModelId",
                table: "Expenses",
                column: "CategoryModelId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Expenses_Categories_CategoryModelId",
                table: "Expenses");

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
                    { "144fa4db-ffd9-4da8-aaf6-3ebc65427912", null, "User", "USER" },
                    { "5b4a557c-8d3b-4060-88ce-bba440ea4453", null, "Admin", "ADMIN" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Expenses_Categories_CategoryModelId",
                table: "Expenses",
                column: "CategoryModelId",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}
