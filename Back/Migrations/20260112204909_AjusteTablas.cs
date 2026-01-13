using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Back.Migrations
{
    /// <inheritdoc />
    public partial class AjusteTablas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Localidades_LocalidadIDLocalidad",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "Barrio",
                table: "Localidades");

            migrationBuilder.RenameColumn(
                name: "LocalidadIDLocalidad",
                table: "Clientes",
                newName: "IDBarrio");

            migrationBuilder.RenameIndex(
                name: "IX_Clientes_LocalidadIDLocalidad",
                table: "Clientes",
                newName: "IX_Clientes_IDBarrio");

            migrationBuilder.CreateTable(
                name: "Barrios",
                columns: table => new
                {
                    IDBarrio = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IDLocalidad = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Barrios", x => x.IDBarrio);
                    table.ForeignKey(
                        name: "FK_Barrios_Localidades_IDLocalidad",
                        column: x => x.IDLocalidad,
                        principalTable: "Localidades",
                        principalColumn: "IDLocalidad");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_IDLocalidad",
                table: "Clientes",
                column: "IDLocalidad");

            migrationBuilder.CreateIndex(
                name: "IX_Barrios_IDLocalidad",
                table: "Barrios",
                column: "IDLocalidad");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Barrios_IDBarrio",
                table: "Clientes",
                column: "IDBarrio",
                principalTable: "Barrios",
                principalColumn: "IDBarrio",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Localidades_IDLocalidad",
                table: "Clientes",
                column: "IDLocalidad",
                principalTable: "Localidades",
                principalColumn: "IDLocalidad",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Barrios_IDBarrio",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Localidades_IDLocalidad",
                table: "Clientes");

            migrationBuilder.DropTable(
                name: "Barrios");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_IDLocalidad",
                table: "Clientes");

            migrationBuilder.RenameColumn(
                name: "IDBarrio",
                table: "Clientes",
                newName: "LocalidadIDLocalidad");

            migrationBuilder.RenameIndex(
                name: "IX_Clientes_IDBarrio",
                table: "Clientes",
                newName: "IX_Clientes_LocalidadIDLocalidad");

            migrationBuilder.AddColumn<string>(
                name: "Barrio",
                table: "Localidades",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Localidades_LocalidadIDLocalidad",
                table: "Clientes",
                column: "LocalidadIDLocalidad",
                principalTable: "Localidades",
                principalColumn: "IDLocalidad",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
