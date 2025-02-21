import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("template_parameters",(table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.uuid("templateId").notNullable().references("id").inTable("templates").onDelete("SET NULL");
        table.string("parameterName",255).notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("template_parameters")
}

