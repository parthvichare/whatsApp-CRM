import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("templates", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.string("templateName",255).notNullable();
        table.string("templateCategory",255);
        table.text("templateBody").notNullable();
        table.jsonb("parameterName")
        table.text("templateId");
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("templates");
}