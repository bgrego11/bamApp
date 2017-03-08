var mysql      = require('mysql');
var inquirer = require('inquirer');

var order = function() {

    var questions = [{
        name: 'id',
        message: 'Enter the ID of the product you wish to buy'
        }, {
        name: 'amount',
        message: 'Enter the quantity you wish to purchase',
    }]
    
    inquirer.prompt(questions).then(function(data) {
            qty = parseInt(data.amount);
            console.log(qty)
            id = data.id;

            
 
            connection.query('select * from products where item_id='+id+";", function (error, results, fields) {
            if (error) throw error;
            stock = parseInt(results[0].quantity_stock);
            dpt = results[0].dept_name
            if (qty <= stock) {
                total = qty * parseFloat(results[0].price);
                console.log("You Purchased "+qty+" "+results[0].item_name+" for a total of "+total);
                newQty = stock - qty;
                connection.query('update products set quantity_stock='+newQty+' where item_id='+id+';');
                connection.query('update products set product_sales = product_sales +'+total+' where item_id='+id+';');
                connection.query("update departments set total_sales = total_sales +"+total+" where department_name like '"+dpt+"' ;")
                connection.end();
            } else {
                console.log("Sorry invalid request. There are less items in stock than the quantity ordered")
                connection.end();
            }
            
            });
            
            
            
        
        
    });
}

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'iniesta79',
  database : 'bamazon'
});
 
connection.connect();
 
connection.query('select * from products', function (error, results, fields) {
  if (error) throw error;
  
  for ( i in results) {
      row = results[i]
      console.log("ID: "+row.item_id+" Name: "+row.item_name+" Price: "+row.price+" quantity: "+row.quantity_stock);
  }
  order();
});






