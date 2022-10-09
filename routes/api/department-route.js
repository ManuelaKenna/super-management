const router = require('express').Router();
const DB = require ("../../config/connection")

router.get ("/", function (req, res) {
    DB.promise().query("SELECT * FROM department").then(function ([departmentData]) {
        res.json(departmentData)
    })
})
router.get ("/:id", function(req, res) {
    DB.promise().query("SELECT * FROM department WHERE id=" + req.params.id).then(function ([departmentData]) {
        res.json(departmentData)
    })
})
router.post ("/", function (req,res) {
    DB.promise().query("INSERT INTO department SET ?", req.body).then(function ([departmentData]) {
        res.json(departmentData)
    })
})
// router.put ("/", function {});

module.exports = router;