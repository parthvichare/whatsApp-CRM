import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("messages", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.uuid("conversationId").references("id").inTable("conversations").onDelete("CASCADE");
        table.string("messageId").notNullable();
        table.string("messageFrom").notNullable();
        table.integer("messageTo",12).notNullable();
        table.enu("direction", ["incoming","outgoing"]).notNullable()
        table.enu("messageType",["text","image","video","template"]).notNullable();                            //text, image, video
        table.text("messageContent").notNullable();
        table.uuid("templateId").references("id").inTable("templates").onDelete("SET NULL");
        table.string("templateName",255).nullable()
        table.string("salesAgentId",255).notNullable(); 
        table
        .enum("status", ["sent", "delivered", "read"])
        .defaultTo("sent"); // Message status
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("messages");
}


