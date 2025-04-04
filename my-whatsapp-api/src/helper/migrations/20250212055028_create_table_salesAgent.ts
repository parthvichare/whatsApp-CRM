import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("salesAgent", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.string("name").nullable();
        table.string("email").nullable();
        table.string("password").notNullable();
        table.string("role").notNullable();
        table.string("salt").notNullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("salesAgent");
}

