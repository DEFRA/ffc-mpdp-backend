-- init.sql
-- Connect to the database
\c ffc_mpdp_backend;

DROP TABLE IF EXISTS public.payment_activity_data;

CREATE TABLE public.payment_activity_data (
    id SERIAL NOT NULL PRIMARY KEY,
    payee_name character varying(32),
    part_postcode character varying(8),
    town character varying(32),
    parliamentary_constituency character varying(32),
    county_council character varying(64),
    scheme character varying(64),
    amount numeric(16, 2),
    financial_year character varying(8),
    payment_date Date,
    scheme_detail character varying(128),
    activity_level character varying(128)
);

INSERT INTO
    public.payment_activity_data(
        id,
        payee_name,
        part_postcode,
        town,
        parliamentary_constituency,
        county_council,
        scheme,
        amount,
        financial_year,
        payment_date,
        scheme_detail,
        activity_level
    )
VALUES
    (
        0,
        'Ryan Carter',
        'LS17',
        'Horsforth',
        'Leeds',
        'West Yorkshire',
        'Sustainable Farming Incentive Pilot',
        100,
        '22/23',
        '2023-04-14',
        'Low and no input Grassland',
        'High'
    ),
    (
        1,
        'Danny Tomas',
        'MH17',
        'Altrincham',
        'Greater Manchester',
        'Manchester City Council',
        'Sustainable Farming Incentive Pilot',
        200,
        '22/23',
        '2023-04-14',
        'Low and no input Grassland',
        'High'
    );
