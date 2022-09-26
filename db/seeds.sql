USE company_db;

INSERT INTO department (department_name) VALUES ("HR"), ("ADMIN"), ("RETAIL"), ("IT"), ("Marketing");
INSERT INTO role (title, salary, department_id) VALUES ("Manager", 60000, 1), ("Secretary", 50000, 2), ("Clerk", 45000, 3), ("Tech Wizard", 75000, 4), ("Social Media", 50000, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jerry", "Garcia", 1, NULL), ("Bob", "Ross", 2, 1), ("Susan", "Powers", 3, 2), ("Stephanie", "Quest", 4, 2), ("Josh", "Lopez", 5, 2);
