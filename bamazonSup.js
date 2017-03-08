var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

//initial prompt
var questions = [{
    name: 'choice',
    message: 'Select a command',
    type: 'list',
    choices: ['View Product Sales by Department', 'Add New Department']
}]

var cmds = questions[0].choices
//initial sql query to get list of products
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'iniesta79',
    database: 'bamazon'
});

connection.connect();

inquirer.prompt(questions).then(function (data) {
    if (data.choice === cmds[0]) {
        connection.query('select *, (total_sales - overhead_cost) as total_profit from departments;', function (error, results, fields) {
            if (error) throw error;
            var table = new Table({
                head: ['department_id', 'department_name', 'overhead_cost', 'total_sales', 'total_profit'],
                colWidths: [10,25,25,25,25]
            });
            results.map(function(row){
                table.push([row.department_id,row.department_name,row.overhead_cost, row.total_sales, row.total_profit])
            })
            console.log(table.toString());
            connection.end();
        });
    }
    if (data.choice === cmds[1]) {
        console.log("this is where the add department would go")
    }
})



// instantiate 


// // table is an Array, so you can `push`, `unshift`, `splice` and friends 
// table.push(
//     ['First value', 'Second value'], ['First value', 'Second value']
// );

