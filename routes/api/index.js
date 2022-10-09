const router = require('express').Router();
const departmentRoute = require ("./department-route")
const employeeRoute = require ("./employee-route")
const rolesRoute = require ("./roles-route")

router.use ("/departments", departmentRoute)
router.use ("/employees", employeeRoute)
router.use ("/roles", rolesRoute)




module.exports = router;