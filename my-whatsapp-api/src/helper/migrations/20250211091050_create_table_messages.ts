import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("messages", (table)=>{
        table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).notNullable().primary();
        table.uuid("conversationId").references("id").inTable("conversations").onDelete("CASCADE");
        table.string("messageId").notNullable();
        table.string("messageFrom").notNullable();
        table.string("messageTo").notNullable();
        table.enu("direction", ["incoming","outgoing"]).notNullable()
        table.enu("messageType",["text","image","video"]).notNullable();                            //text, image, video
        table.text("messageContent").notNullable();
        table
        .enum("status", ["sent", "delivered", "read"])
        .defaultTo("sent"); // Message status
        table.timestamp("createdAt").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("messages");
}
