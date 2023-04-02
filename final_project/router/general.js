const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (username && password) {
		if (!isValid(username)) { 
			users.push({"username":username,"password":password});
			return res.status(200).json({message: "User successfully registred. Now you can login" + "." + "\n"});
		} else {
			return res.status(404).json({message: "User already exists" + "!" + "\n"});    
		}
	} 
	return res.status(404).json({message: "Unable to register user" + "." + "\n"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
	return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
	// i'm assuming that the keys of the "books" associative array are ISBN numbers
	let isbn = req.params.isbn;
	if(books[isbn]) {
		return res.send(books[isbn]);
	} else {
		return res.send("ISBN #" + isbn + " not found.");
	}
 });
	
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
	let results = [];
	let keys = Object.keys(books);
	for (i = 0; i < keys.length; i++) {
		// case-insensitive search by name part
		// reference: https://stackoverflow.com/questions/177719/case-insensitive-search/177775#177775
		if(books[keys[i]].author.search(new RegExp(req.params.author, "i")) >= 0) {
			results.push(books[keys[i]]);
		}
	}
	if (results.length > 0) {
		return res.send(results);
	} else {
		return res.send("Not found.");
	}
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
	let results = [];
	let keys = Object.keys(books);
	for (i = 0; i < keys.length; i++) {
		// case-insensitive search by title part
		// reference: https://stackoverflow.com/questions/177719/case-insensitive-search/177775#177775
		if(books[keys[i]].title.search(new RegExp(req.params.title, "i")) >= 0) {
			results.push(books[keys[i]]);
		}
	}
	if (results.length > 0) {
		return res.send(results);
	} else {
		return res.send("Not found.");
	}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	let book = books[req.params.isbn];
	// TODO: optimize this code
	if(book === undefined) {
		res.send("Book not found.");
	} else {
		res.send(books[req.params.isbn].reviews);
	}
});

module.exports.general = public_users;
