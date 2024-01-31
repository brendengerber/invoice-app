--Builds the initial tables for the project
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----is this anywhere near right for using with passport? any stack exchange answers
--index google_id and github_id in this case
--**make id_from_provider and provider a joint key
CREATE TABLE users (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "provider" varchar(15),
    "remote_id" integer,
    "photo_url" varchar(150),
    "email" varchar(150)
);

CREATE TABLE invoices (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "user_id" UUID REFERENCES users(id) NOT NULL,
  "status" varchar(15),
  "invoice_number" integer,
  "bill_from_street_address" varchar(150),
  "bill_from_city" varchar(150),
  "bill_from_postal_code" integer,
  "bill_from_country" varchar(150),
  "bill_to_name" varchar(150),
  "bill_to_email" varchar(150),
  "bill_to_street_address" varchar(150),
  "bill_to_city" varchar(150),
  "bill_to_postal_code" integer,
  "bill_to_country" varchar(150),
  "date" date, 
  "payment_terms" varchar(15000),
  "project_description" varchar(15000),
  "amount_due" numeric(100, 2)
);

--Items that are included on invoices
CREATE TABLE items (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "invoice_id" UUID REFERENCES invoices(id) NOT NULL,
  "user_id" UUID REFERENCES users(id) NOT NULL,
  "name" varchar(150),
  "quantity" integer,
  "price" numeric(100, 2),
  "total" numeric(100, 2)
);

CREATE INDEX invoices_user_id_idx ON invoices(user_id);
CREATE INDEX items_invoice_id_idx ON items(invoice_id);
CREATE INDEX items_user_id_idx ON items(user_id);