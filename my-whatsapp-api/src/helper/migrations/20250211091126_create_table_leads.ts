import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("leads", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.string("name").notNullable();
        table.string("phoneNumber").unique().notNullable();
        table.uuid("salesAgentId").notNullable().references("id").inTable("salesAgent").onDelete("SET NULL");
        table
        .enum("leadStatus",["hot","cold","notInterested","converted"])
        .defaultTo("cold")
        table.timestamps(true,true,true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("leads");
}

