const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// returns boolean
const isValid = (username)=>{
	// write code to check is the username is valid
	// code borrowed from user auth lab
	let userswithsamename = users.filter((user) => {
		return user.username === username
	});
	return userswithsamename.length > 0;
}

// returns boolean
const authenticatedUser = (username,password)=>{
	// write code to check if username and password match the one we have in records.
	// code borrowed from user auth lab
	let validusers = users.filter((user) => {
		return (user.username === username && user.password === password)
	});
	return validusers.length > 0;
}

// only registered users can login
regd_users.post("/login", (req,res) => {
	// code borrowed from user auth lab
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({message: "Error logging in" + "." + "\n"});
	}

	if (authenticatedUser(username,password)) {
		let accessToken = jwt.sign({
			data: password
		}, 'access', { expiresIn: 60 * 60 });

		req.session.authorization = {
			accessToken,username
		}
		return res.status(200).send("User successfully logged in" + "." + "\n");
	} else {
		return res.status(208).json({message: "Invalid Login. Check username and password" + "." + "\n"});
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	// Write your code here
	let book = books[req.params.isbn];
	let user = req.session.authorization.username;
	let review = req.body.review;

	if (book) {
		book.reviews[user] = review;
		return res.send("Review sent successfully.");
	} else {
		return res.send("Invalid ISBN: " + req.params.isbn);
	}
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
	// Write your code here
	let book = books[req.params.isbn];
	let user = req.session.authorization.username;
	let review = req.body.review;

	if (book) {
		delete book.reviews[user];
		return res.send("Review deleted successfully.");
	} else {
		return res.send("Invalid ISBN: " + req.params.isbn);
	}
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
