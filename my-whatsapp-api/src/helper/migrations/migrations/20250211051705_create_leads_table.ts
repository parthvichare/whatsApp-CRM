import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("leads", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.string("name").notNullable();
        table.integer("phoneNumber").unique().notNullable();
        table.timestamps(true,true,true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("leads");
}

