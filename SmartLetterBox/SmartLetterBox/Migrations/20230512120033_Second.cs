using Microsoft.EntityFrameworkCore.Migrations;

namespace SmartLetterBox.Migrations
{
    public partial class Second : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Unread",
                table: "Letters");

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "Letters",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Letters");

            migrationBuilder.AddColumn<bool>(
                name: "Unread",
                table: "Letters",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
