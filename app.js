var mysql      = require('mysql');
const express  = require('express');
var bodyParser = require('body-parser');

// connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'todo_list'
});
  
  connection.connect();
  var id=0;
  var app=express();
  app.set('view engine','ejs');
  app.use(bodyParser.urlencoded({ extended: false }))

  //   ======================================================================================admin_login
app.get('/admin',function(req,res){
    res.render("admin");
})
app.post('/admin',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var admin_login_query = "select * from admin where email = '"+email+"' and password = '"+password+"'"
    connection.query(admin_login_query,function(error,result,field){
        if(error) throw error;
        if(result.length==1){
            res.redirect("/admin_dashboard");
        }
        else{
            res.redirect("/admin_login");
        }
    });
   
});
// ======================================================================================admin dashboard
app.get('/admin_dashboard',function(req,res){
    res.render("admin_dashboard");
})

// ===============================================================================================user
app.get('/user_register',function(req,res){
     res.render("user_register");
})
app.post('/user_register',function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;
    
    var user_login_query = "insert into user(name,email,password)values('"+name+"','"+email+"','"+password+"')";
    connection.query(user_login_query,function(error,result,field){
        res.redirect("/user_register")
    })  
})
app.get('/user_login',function(req,res){
    res.render("user_login");
})
app.post('/user_login',function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var user_login_query = "select * from user where email = '"+email+"' and password = '"+password+"'";
    connection.query(user_login_query,function(error,result,field){
        if(error) throw error;
        if(result.length==1){
            id=result[0].u_id;
            res.redirect('/user_dashboard');
            // console.log(id);
        }
        else{
            res.redirect("/user_login");
        }
    });
});
app.get('/user_dashboard',function(req,res){
  
   var select = "SELECT * FROM task where u_id='"+id+"'";
   connection.query(select,function(error,result,field){
    if (error) throw error;
    res.render('user_dashboard',{result})
   })
})
// ================================================================================update user

app.get('/manage_user/:u_id',function(req,res){
    var u_id= req.params.u_id;
    var update = "select * from user where u_id="+u_id;
    connection.query(update, function (error, result, fields) {
        if (error) throw error;
        res.render("manage_user",{result});
      });
  })
  app.post('/manage_user/:u_id',function(req,res){
    var u_id= req.params.u_id;
    var name= req.body.name;
    var email= req.body.email;
    var password= req.body.password;
    var update = "update user set name='"+name+"', email='"+email+"',password='"+password+"' where u_id="+u_id;
    connection.query(update, function (error, result, fields) {
        if (error) throw error;
        res.redirect("/admin_dashboard");
      });
  })
//============================================================================================== task
app.get('/add_task',function(req,res){
    var select_data;
    var view_user_query = "select * from user";
    var select_query = "select * from task";

    connection.query(select_query,function(error,result,field){
        if (error) throw error;
        select_data=result;
    })
    connection.query(view_user_query,function(error,result,field){
        if (error) throw error;
        res.render('add_task',{result,select_data});
    })
})
app.post('/add_task',function(req,res){
    var task = req.body.task;
    var u_id = req.body.u_id;
    

    var view_user_query = "insert into task (task,u_id) values('"+task+"','"+u_id+"')";
    connection.query(view_user_query,function(error,result,field){
        if(error) throw error;
        res.redirect('/add_task');
    })
})
app.get('/update_task/:t_id',function(req,res){
    var t_id=req.params.t_id;
    var update_task="select * from task where t_id= '"+t_id+"'";
    connection.query(update_task,function(error,result,field){
        if(error) throw error;
        res.render('update_task',{result});
    });
})
app.post('/update_task/:t_id',function(req,res){
    var t_id= req.params.t_id;
    var status= req.body.status;
    var update = "update task set status='"+status+"' where t_id='"+t_id+"'";
    connection.query(update,function(error,result,field){
        if (error) throw error;
        res.redirect('/user_dashboard');
    });
})
app.post('/admin',function(req,res){
    res.redirect('/admin');
})


app.listen(3000)