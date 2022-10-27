DROP table if exists public.payment_activity_data;
CREATE TABLE public.payment_activity_data
(
  id SERIAL NOT NULL PRIMARY KEY,
  payee_name character varying(32),
  part_postcode character varying(8),
  town character varying(32),
  parliamentary_constituency character varying(32),
  county_council character varying(64),
  scheme character varying(64),
  activity_detail character varying(128),
  amount numeric(16, 2),
  -- These fields are hidden in backend until it is used
  financial_year character varying(8),
  payment_date Date
);

-- select data
select * from public.payment_activity_data;
