const { default: axios } = require('axios');

const apiController = {};

apiController.findBook = (req, res, next) => {
  if (res.locals.bookInDB) return next();
  const { isbn } = req.body;
  let authorEndpoint;
  axios.get(`https://openlibrary.org/isbn/${isbn}.json`)
    .then((response) => {
      const bookInfo = response.data;
      let { title, authors, subjects } = bookInfo;
      if (!subjects) subjects = ['Unknown'];
      if (!authors) authors = ['Unknown'];
      res.locals.authorEndpoint = authors[0].key;
      res.locals.book = { isbn_13: isbn, title: title, subjects: subjects[0] };
      return next();
    })
    .catch((err) => {
      const defaultErr = {
        log: 'ERROR found in apiController.findBook',
        message: { err: `There was an error${err}` },
      };
      return next(defaultErr);
    });
};

apiController.findAuthor = (req, res, next) => {
  if (res.locals.bookInDB) return next();
  const { authorEndpoint } = res.locals;
  // if author code was not found in apiController.findBook, move onto next middleware function and make author property unknown
  if (!authorEndpoint) {
    res.locals.book.author = 'Unknown';
    return next();
  }
  axios.get(`https://openlibrary.org/${authorEndpoint}.json`)
    .then((response) => {
      const authorInfo = response.data;
      const author = authorInfo.name;
      res.locals.book.author = author;
      return next();
    })
    .catch((err) => {
      const defaultErr = {
        log: 'ERROR found in apiController.findAuthor',
        message: { err: `There was an error${err}` },
      };
      return next(defaultErr);
    });
};

module.exports = apiController;