import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("messages", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table
    })
}


export async function down(knex: Knex): Promise<void> {
}

