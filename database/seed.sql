USE ClientOpsStudio;
GO

INSERT INTO dbo.users (name, email, password_hash, role)
VALUES (
  'Malik Farhan',
  'malik@example.com',
  '160d77c1a6ef3e1477bd14f4d7e9f4d4212ff6be83160b9df95d447acb0afbd5',
  'admin'
);

INSERT INTO dbo.projects (client_name, project_name, status, budget, health_score, stack, due_date)
VALUES
  ('Acme Health', 'Patient Intake Dashboard', 'active', 8500, 94, 'React,MUI,Node,Express,MSSQL', '2026-08-15'),
  ('Northwind Ops', 'API Performance Sprint', 'review', 4200, 88, 'Node,Express,MSSQL,JWT', '2026-07-28'),
  ('BrightRetail', 'Admin Portal Rebuild', 'planning', 6200, 81, 'React,Tailwind,MUI,REST', '2026-09-04');

INSERT INTO dbo.audit_events (actor, action, message)
VALUES
  ('Malik Farhan', 'LOGIN_READY', 'JWT authentication and protected route flow configured.'),
  ('System', 'INDEX_READY', 'Project status and due-date indexes are available for list queries.'),
  ('System', 'API_READY', 'Dashboard summary and project filtering endpoints are available.');
