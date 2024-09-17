using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iSmart.Entity.Migrations
{
    public partial class InventoryCheckingUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StatusId",
                table: "InventoryChecks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryChecks_StatusId",
                table: "InventoryChecks",
                column: "StatusId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryCheck_Status",
                table: "InventoryChecks",
                column: "StatusId",
                principalTable: "Status",
                principalColumn: "StatusId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryCheck_Status",
                table: "InventoryChecks");

            migrationBuilder.DropIndex(
                name: "IX_InventoryChecks_StatusId",
                table: "InventoryChecks");

            migrationBuilder.DropColumn(
                name: "StatusId",
                table: "InventoryChecks");
        }
    }
}
