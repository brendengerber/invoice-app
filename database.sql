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
  "user_id" UUID REFERENCES users(uuid) NOT NULL,
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
  "user_id" UUID REFERENCES users(uuid) NOT NULL,
  "name" varchar(150),
  "quantity" integer,
  "price" numeric(100, 2),
  "total" numeric(100, 2)
);

CREATE INDEX invoices_user_id_idx ON invoices(user_id);
CREATE INDEX items_invoice_id_idx ON items(invoice_id);
CREATE INDEX items_user_id_idx ON items(user_id);


--Then after authentication req.user will contain id (specific to providor) and providor properties 
--Then serialize to save the provider and id_from_provider, to be used to look up the full user object with it's unique uuid and a dual key of providor and id_from_provider
--that way, req.user.uuid can be used to look up all of the data in other tables
--deserialize will use the id and providor to look up the whole user along with it's uuid and attatch it to the req
--when does the oauth user get saved to the database users table? i.e saving id as id_from_providor. When first authenticating? during serialize?
--maybe right after authentication using a new middleware to save the user data stored in memory currently to the database in the users table.
--then next time someone will be able to deserialize when a current session is found and that second middleware has saved the userData to be used later by deserialize to find all the data


--https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

-- psuydo code
-- serialize{
--   save id and provider to the session

-- }


-- deserialize{
--   use session id and provider to...
--   findUser(id, provider)
--   attatch the result to req.body
-- }

-- second middleware after calling authenticate
-- saveUserData(req){
--   checks if the user already exists and creates it if not
--   saves any req properties desired to columns in the users database
--   save id as id_from_provider (used to deserialize later)
--   save provider (used to deserialize later)
--   save avatar_url to photo_url (different name for github and google?)(only save if null, then you have to change the avatar in app not from authentication)
--   save email
-- }

--doesnt matter to save the real user after authentication, because after serialization and saving the user data, the route ends by redirecting, then the next route will begin with deserializing and the full user object will be available to use as you like