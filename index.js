const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");
const express = require("express");
require("dotenv").config();

initializeDatabase();

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// * Create new book data

const createNewBookData = async (newBookData) => {
  try {
    const newBook = new Book(newBookData);
    return await newBook.save();
  } catch (error) {
    console.log(
      `An error occured while trying to add new book data.\nError:\n${error}`
    );
  }
};

app.post("/books", async (req, res) => {
  try {
    const bookData = req.body;

    if (
      !bookData.title ||
      !bookData.author ||
      !bookData.publishedYear ||
      !bookData.language
    ) {
      res.status(400).json({
        error: "title, author, publishedYear and language are required.",
      });
    } else {
      const newBook = await createNewBookData(req.body);
      if (newBook) {
        res
          .status(201)
          .json({ message: "Book added successfully.", book: newBook });
      } else {
        res.status(500).json({ error: "Failed to cretae new book data." });
      }
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add book.", errMsg: `Error:\n${err}` });
  }
});

// * Read all books

const readAllBooks = async () => {
  try {
    return await Book.find();
  } catch (error) {
    console.log("An error occured while trying to return");
  }
};

app.get("/books", async (req, res) => {
  try {
    const allBooks = await readAllBooks();
    if (allBooks.length != 0) {
      res.json(allBooks);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get books data." });
  }
});

// * Read book by title
const readBookByTitle = async (bookTitle) => {
  try {
    return await Book.findOne({ title: bookTitle });
  } catch (error) {
    console.log(
      `An error occured while trying to get book with title: ${bookTitle}.\nError:\n${error}`
    );
  }
};

app.get("/books/:title", async (req, res) => {
  try {
    if (req.params.title) {
      const bookByTitle = await readBookByTitle(req.params.title);
      if (bookByTitle) {
        res.json(bookByTitle);
      } else {
        res
          .status(200)
          .json({ message: `No book for title: ${req.params.title}` });
      }
    } else {
      res.status(400).json({ error: "title is required." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get book." });
  }
});

// * Read book by Author
const readBookByAuthor = async (author) => {
  try {
    return await Book.find({ author: author });
  } catch (err) {
    console.log(
      `An error occured while trying to get book by author: ${author}.\nError:\n${err}`
    );
  }
};

app.get("/books/authors/:authorName", async (req, res) => {
  try {
    if (req.params.authorName) {
      const allBooksByAuthor = await readBookByAuthor(req.params.authorName);
      if (allBooksByAuthor != 0) {
        res.json(allBooksByAuthor);
      } else {
        res.status(200).json({
          message: `No books found for author: ${req.params.authorName}`,
        });
      }
    } else {
      res.status(400).json({ error: "author is required." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get books." });
  }
});

// * Read books by genre
const readBooksByGenre = async (genre) => {
  try {
    return await Book.find({ genre: genre });
  } catch (err) {
    console.log(
      `An error occured while trying to get books by genre: ${genre}.\nError:\n${err}`
    );
  }
};

app.get("/books/genres/:genre", async (req, res) => {
  try {
    if (req.params.genre) {
      const booksByGenre = await readBooksByGenre(req.params.genre);
      if (booksByGenre.length != 0) {
        res.json(booksByGenre);
      } else {
        res
          .status(200)
          .json({ message: `No books found for genre: ${req.params.genre}` });
      }
      if (!booksByGenre) {
        throw new Error();
      }
    } else {
      res.status(400).json({ error: "genre is required." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get books." });
  }
});

// * Read books by release year
const readBooksByPublishedYear = async (publishedYear) => {
  try {
    return await Book.find({ publishedYear: publishedYear });
  } catch (err) {
    console.log(
      `An error occured while trying to get books by release year: ${publishedYear}.\nError:\n${err}`
    );
  }
};

app.get("/books/publishedYear/:year", async (req, res) => {
  try {
    const publishedYear = Number(req.params.year);
    if (Number.isNaN(publishedYear)) {
      throw new Error("publishedYear must be Number.");
    }

    if (publishedYear) {
      const booksByPublishedYear = await readBooksByPublishedYear(
        publishedYear
      );
      if (!booksByPublishedYear) {
        throw new Error();
      }
      if (booksByPublishedYear.length != 0) {
        res.json(booksByPublishedYear);
      } else {
        res.status(200).json({
          message: `No books found published in year: ${publishedYear}`,
        });
      }
    } else {
      res.status(400).json({ error: "publishedYear is required." });
    }
  } catch (err) {
    res.status(500).json({
      error: `Failed to get books.`,
      msg: `${err}`,
    });
  }
});

// * Update book rating by Id
const updateBookRatingById = async (bookId, dataToUpdate) => {
  try {
    return await Book.findByIdAndUpdate(bookId, dataToUpdate, { new: true });
  } catch (err) {
    console.log(
      `An error occured while trying to update book rating.\nError:\n${err}`
    );
  }
};

app.post("/books/rating/id/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const newRating = req.body.rating;
    if (bookId && newRating) {
      const updatedBook = await updateBookRatingById(bookId, req.body);
      if (updatedBook) {
        res.status(200).json({
          message: "Book data updated successfully.",
          updatedBook: updatedBook,
        });
      } else {
        res
          .status(200)
          .json({ message: `No book found for the Id: ${bookId}` });
      }
    } else {
      res.status(400).json({ error: "bookId and rating is required." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// * Update book rating by title
const updateBookRatingByTitle = async (bookTitle, dataToUpdate) => {
  try {
    return await Book.findOneAndUpdate({ title: bookTitle }, dataToUpdate, {
      new: true,
    });
  } catch (err) {
    console.log(
      `An error occured while trying to update book.\nError:\n${err}`
    );
  }
};

app.post("/books/rating/title/:bookTitle", async (req, res) => {
  try {
    const bookTitle = req.params.bookTitle;
    const newRating = req.body.rating;
    if (bookTitle && newRating) {
      const updatedBook = await updateBookRatingByTitle(bookTitle, req.body);
      if (updatedBook) {
        res.status(200).json({
          message: "Book data updated successfully.",
          updatedBook: updatedBook,
        });
      } else {
        res
          .status(200)
          .json({ message: `No book found with the title: ${bookTitle}` });
      }
    } else {
      res.status(400).json({ error: "title & rating are required." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
