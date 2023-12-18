
DROP table if exists public.schema_payment_data;
CREATE TABLE public.schema_payment_data
(
  id SERIAL NOT NULL PRIMARY KEY,
  scheme character varying(64),
  total_amount numeric(16, 2),
  financial_year character varying(8),
);

-- select data
select * from public.schema_payment_data;
