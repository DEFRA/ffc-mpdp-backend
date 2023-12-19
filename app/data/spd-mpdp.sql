DROP table if exists public.aggregate_scheme_payments;

CREATE TABLE public.aggregate_scheme_payments (
  id SERIAL NOT NULL PRIMARY KEY,
  scheme character varying(64),
  total_amount numeric(16, 2),
  financial_year character varying(8),
);

-- select data
select
  *
from
  public.aggregate_scheme_payments;