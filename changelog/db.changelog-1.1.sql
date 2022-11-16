--changeset author:VMuthu  
ALTER TABLE payment_activity_data
  ADD COLUMN scheme_detail character varying(128),
  ADD COLUMN activity_level character varying(16);
ALTER TABLE payment_activity_data DROP COLUMN activity_detail;