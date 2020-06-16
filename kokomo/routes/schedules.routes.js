const express = require('express');
const router  = express.Router();
const Property = require('../models/property.model');
const mongoose = require('mongoose');
const schedule_controller = require('../controllers/schedule.controllers');

//ruta post schedules
router.post('/schedule/add', (req, res, next) => {
    const {
      title,
      author,
      description,
      rating
    } = req.body;
    const newBook = new Book({
      title,
      author,
      description,
      rating
    });
    newBook.save()
      .then((book) => {
        res.redirect('/books');
      })
      .catch((error) => {
        console.log(error);
      });
  });
  