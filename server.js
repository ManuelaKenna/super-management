// const routes = require ("./routes")
const mysql = require('mysql2');
const inquirer = require('inquirer');
const {printTable} = require('console-table-printer');

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'company_db'
},
);


db.connect((err) => {
    if (err) throw err;
});

const startTrackerApp = () => {
    inquirer.prompt([{
        type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: ['View All Departments', 'Add Department', 'View all Employees', 'Add Employee', 'Update Employee Role', 'Update Employee Manager' , 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'exit']
    }

    ]).then((response) => { 
        console.log(response);
        switch (response.userChoice) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View all Employees':
                viewAllEmployees();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Exit':
                // db.end();
                // console.timeLog('\n Exit Employee Tracker.\n');
                // return;
            default:
                break;
        }
    })
};

function viewAllDepartments() {
    db.promise().query(`SELECT * FROM department`)
    .then(([departmentData]) => {
        printTable(departmentData);
        startTrackerApp();
    })};

function addDepartment() {
    inquirer.prompt([{
        type: 'input',
        name: 'department',
        message: 'What Department would you like to add?'
    },
    ]).then(({ department }) => {
        db.query('INSERT INTO department SET ?', {
            department_name: department
        },
            function (err) {
                if (err) throw err;
                console.log(`${department} is added to departments.`);
                // startTrackerApp();
                viewAllDepartments();
            }
        );
    },
    )
};

function viewAllRoles() {
    db.promise().query(`SELECT * FROM roles LEFT JOIN department ON roles.department_id = department.id`).then(([response])=>{
        printTable(response);
        startTrackerApp();
    })

};

async function addRole() {
    const [departments] = await db.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(department => ({ name: department.department_name, value: department.id }))

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the new roles title?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary?'
        },
        {
            type: 'list',
            name: 'departmentid',
            message: 'Please select department',
            choices: departmentArray
        },
    ]).then(answers => {
        var roleObject = {
            title: answers.title,
            salary: answers.salary,
            department_id: answers.departmentid
        }
        db.query("INSERT INTO roles SET ?", roleObject, function (err) {
            if (err) throw err;
            console.log(`${roleObject.title} was successfully added to database`);
            // startTrackerApp();
            viewAllRoles();
        }
        )
    })
};

function viewAllEmployees() {
    db.promise().query(`SELECT CONCAT (employee.first_name," ", employee.last_name) AS Name, roles.title AS Title, roles.salary AS Salary, CONCAT (manager.first_name, " ", manager.last_name) AS Manager, department.department_name AS Department FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`).then(([response])=>{
        printTable(response);
        startTrackerApp();
    })
};

//function to add an Employee
async function addEmployee() {
    const [roles] = await db.promise().query("SELECT * FROM roles")
    const rolesArray = roles.map(role => ({ name: role.title, value: role.id }))
    const [managers] = await db.promise().query("SELECT * FROM employee")
    const managersArray = managers.map(manager => ({ name: manager.first_name + ' ' + manager.last_name, value: manager.id }))
    console.log(managersArray)

    inquirer.prompt([
        {
            type: "input",
            message: "Employee's first name?",
            name: 'firstName'
        },
        {
            type: "input",
            message: "Employee's last name?",
            name: 'lastName'
        },
        {
            type: "list",
            message: "What is the employee's role?",
            choices: rolesArray,
            name: 'roles'
        },
        {
            type: "list",
            message: "Who is the employee's manager?",
            choices: managersArray,
            name: 'manager'
        },
    ]).then(answer => {
        // emplFirstName = answer.firstName;
        // emplLastName = answer.lastName;
        console.log(answer)
        var employeeObject = { first_name: answer.firstName, last_name: answer.lastName, role_id: answer.roles, manager_id: answer.manager }
        db.query(`INSERT INTO employee SET ?`, employeeObject,

            function (err) {
                if (err) throw err;
                viewAllEmployees();
                // console.table('\n',res,'\n');
            })
    })
    // startTrackerApp();

};
// function to update an employee role 
    async function updateEmployeeRole() {
    const [roles] = await db.promise().query("SELECT * FROM roles")
    const rolesArray = roles.map(role => ({
        name: role.title, value: role.id
    }))
    let employeeDataList
    db.query(`SELECT first_name, last_name, id FROM employee `,
        function (err, res) {
            if (err) throw err;
            console.table('\n', res, '\n');
            employeeDataList = res.map(employee => ({name: employee.first_name+" "+employee.last_name, value: employee.id}) )
            // console.table(employeeDataList);
            inquirer.prompt([
                {
                    type: "list",
                    messages: "Who's role would you like to update?",
                    choices: employeeDataList,
                    name: "employee"
                },
                {
                    type: "list",
                    messages: "What role do you want to assign?",
                    choices: rolesArray,
                    name: "role_id"
                },
            ]).then(response => {
               db.query(`UPDATE employee SET role_id = ${response.role_id} WHERE employee.id = ${response.employee}`,  function (err) {
                if (err) throw err;
                viewAllEmployees();
                // console.table('\n',res,'\n');
            })
            });

        });
};


async function updateEmployeeManager() {

    const [managers] = await db.promise().query("SELECT * FROM employee")
    const managerArray = managers.map(manager => ({
        name: manager.first_name + manager.last_name, value: manager.id
    }))
    let employeeDataList
    db.query(`SELECT first_name, last_name, id FROM employee `,
        function (err, res) {
            if (err) throw err;
            console.table('\n', res, '\n');
            employeeDataList = res.map(employee => ({name: employee.first_name+" "+employee.last_name, value: employee.id}) )
            // console.table(employeeDataList);
            inquirer.prompt([
                {
                    type: "list",
                    messages: "Who's manager would you like to update?",
                    choices: employeeDataList,
                    name: "employee"
                },
                {
                    type: "list",
                    messages: "Who is the new manager?",
                    choices: managerArray,
                    name: "manager_id"
                },
            ]).then(response => {
               db.query(`UPDATE employee SET manager_id = ${response.manager_id} WHERE employee.id = ${response.employee}`,  function (err) {
                if (err) throw err;
                viewAllEmployees();
                // console.table('\n',res,'\n');
            })
            });

        });
};

startTrackerApp();








