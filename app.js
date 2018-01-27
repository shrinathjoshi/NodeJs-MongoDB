var express=require('express');

// creating an instance of express in aour app variable which acts routes etc
var app=express();

//body-parser alows us to grab elements from the frontend and parameter from the url
var bodyParser=require('body-parser');

//Creating a mongoose instance
var mongoose=require('mongoose');

//Declaring a port
var port=8080;

//Importing the model Book form model.js
var Book=require('./model');


//var db='mongodb://localhost/example';
//mongoose.connect(db);

mongoose.connect('mongodb://localhost/example',{useMongoClient:true});
var db=mongoose.connection;
db.on('error',console.error.bind(console,'MongoDB connection Error :'));


app.use(bodyParser.json()); //will allow us to parse Json Elements
app.use(bodyParser.urlencoded({  //will allow us to receive body elements through the url so that we can use it with Postman

 	extended:true
}));

app.get('/',function(req,res){

	res.send('Happy to be Here');
});


// Query to get all the books
app.get('/books',function(req,res){
	console.log('getting all books');
	Book.find({})
	.exec(function(err,books){
		if(err)
		{
			res.send('error has occured');
		}
		else
		{
			console.log(books);
			res.json(books);
		}
	});
});



app.get('/books/:id',function(req,res){
	console.log('getting one book');
	Book.findOne({
		_id: req.params.id
	})
	.exec(function(err,book){
		if(err)
		{
			res.send('error Occured');
		}
		else
		{
			console.log(book);
			res.json(book);
		}
	})
})

//To add a post route
app.post('/book',function(req,res){
	var newBook=new Book();

	newBook.title=req.body.title;
	newBook.author=req.body.author;
	newBook.category=req.body.category;

	newBook.save(function(err,book){
		if(err)
		{
			res.send("Error Saving Books");
		}
		else
		{
			console.log(book);
			res.send(book);
		}
	});
});


app.post('/book2',function(req,res){
	Book.create(req.body,function(err,book){
		if(err)
		{
			console.log("error saving Book");
		}
		else
		{
			console.log(book);
			res.send(book);
		}
	});
});




// To update an entry
app.put('/book/:id',function(req,res){
	Book.findOneAndUpdate({
		_id:req.params.id
	},{$set: { title :req.body.title}},{upsert: true},function(err,newBook){
		if(err)
		{
			console.log("error occured ");
		}
		else
		{
			console.log(newBook);
			res.send(newBook);
		}

	});
});

//To delete an entry
app.delete('/book/:id',function(req,res){
	Book.findOneAndRemove({
		_id:req.params.id
	},function(err,book){
		if(err)
		{
			console.log("Error Deleteing");
			res.send('Delete Error');

		}
		else
		{
			console.log(book);
			res.status(204);
		}
	});
});


app.listen(port,function(){
	console.log('App listening on port '+ port);
});