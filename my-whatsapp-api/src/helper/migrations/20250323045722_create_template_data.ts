import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("templateData",(table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.uuid("templateName").references("templateName").inTable("templates").onDelete("SET NULL");
        table.string("templateCategory",255).notNullable();
        table.uuid("salesAgentId").references("id").inTable("salesAgent").onDelete("CASCADE");
        table.text("templateBody").notNullable();
        table.jsonb("sampleValues").notNullable();
        table.timestamps(true,true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("templateData")
}

