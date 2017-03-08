var mysql = require('mysql');
var inquirer = require('inquirer');

//initial prompt
var questions = [{
    name: 'choice',
    message: 'Select a command',
    type: 'list',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
}]
//initial sql query to get list of products
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'iniesta79',
    database: 'bamazon'
});
itemArr = [];
connection.connect();
connection.query('select * from products order by item_id asc;', function (error, results, fields) {
    if (error) throw error;
    for (i in results) {
        row = results[i]
        itemArr.push(row.item_name);
    }

    //conditionals determined by initial user selection
    inquirer.prompt(questions).then(function (data) {
        choice = data.choice;
        if (choice === 'View Products for Sale') {
            // if they want to view all prods query for everything with at least 1 in stock and write to console
            connection.query('select * from products where quantity_stock > 0;', function (error, results, fields) {
                if (error) throw error;
                for (i in results) {
                    row = results[i]
                    console.log("ID: " + row.item_id + " Name: " + row.item_name + " Price: " + row.price + " quantity: " + row.quantity_stock);
                }
            });
            connection.end();
        } else if (choice === 'View Low Inventory') {
            //if they wanna see whats low query for all with stock < 5
            connection.query('select * from products where quantity_stock < 5;', function (error, results, fields) {
                if (error) throw error;
                for (i in results) {
                    row = results[i]
                    console.log("ID: " + row.item_id + " Name: " + row.item_name + " Price: " + row.price + " quantity: " + row.quantity_stock);
                }
            });
            connection.end();

        } else if (choice === 'Add to Inventory') {
            //run function to update inventory this is modularized bc i couldnt get the list to populate correctly and this seemed like a fix
            addFlag = true;
        } else if (choice === 'Add New Product') {
            //get params for new sql record then insert into db
            questions = [{
                    name: 'name',
                    message: 'What is the name of the new product?',
                }, {
                    name: 'department',
                    message: 'What department/category does this product fall under?'
                },
                {
                    name: 'price',
                    message: 'What is the per unit price of this item?'
                },

                {
                    name: 'qty',
                    message: 'How many of this item should be added to Inventory',
                }
            ]

            inquirer.prompt(questions).then(function (data) {
                name = data.name;
                dpmt = data.department;
                price = parseFloat(data.price);
                qty = data.qty;

                connection.query('INSERT INTO products (item_name,dept_name,price,quantity_stock) values ("' + name + '","' + dpmt + '",' + price + ',' + qty + ');', function (error, results, fields) {
                    if (error) throw error;
                    console.log("You have added a new item to the inventory")

                });
                connection.end();
            });
        }


    }).then(function () {
        addItem(addFlag);

    });
});

console.log(itemArr);

var addFlag = false;

function addItem(flag) {

    //gets item name and num to add from user gets item_id from name then updates db  
    if (flag) {
        questions = [{
            name: 'choice',
            message: 'Select item to increase stock of',
            type: 'list',
            choices: itemArr
        }, {
            name: 'qty',
            message: 'How many of this item should be added to Inventory',
        }]
        inquirer.prompt(questions).then(function (data) {
            qty = data.qty;
            id = itemArr.indexOf(data.choice) + 1;
            connection.query('UPDATE products SET quantity_stock = quantity_stock + ' + qty + ' where item_id=' + id + ';', function (error, results, fields) {
                if (error) throw error;
                console.log("You have added " + qty + ' of item_id ' + id + ' to the inventory')

            });
            connection.end();


        })
    }
}