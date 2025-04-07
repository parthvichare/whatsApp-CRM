import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("conversations",(table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.uuid("leadId").references('id').inTable("leads").onDelete("CASCADE");
        table.uuid("assignedTo").nullable().references("id").inTable("salesAgent").onDelete("SET NULL");
        table.timestamps(true,true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("conversations");
}

