const debug = require('debug')('contacts:index');
var express = require('express');
var router = express.Router();
const pool = require('../connectionPool');
const Joi = require('joi');

const contactSchema = Joi.object({
  first: Joi.string().allow(''),
  last: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required(),
  email: Joi.string().allow(''),
  phone: Joi.string().allow('')
});

/* GET home page. */
router.route('/api')
  .get((req, res, next) => {
    pool.query('SELECT * FROM contacts', (error, results, fields) => {
      if (error) {
        //res.statusCode = 500;
        //res.end();
        console.log(error);
        return res.sendStatus(500);
      }
      res.send(results);
    });
  })
  .post((req, res, next) => {
    /*if (!req.body.last || req.body.last.length < 3 || req.body.last.length > 50) {
      return res.status(400).send('Last name is required and must be between 3 and 50 characters long');
    }*/

    const result = contactSchema.validate(req.body, { abortEarly: false });
    // debug(result);
    if (result.error) {
      return res.status(500).send(result.error.message);
    }

    pool.query('INSERT INTO contacts(first, last, email, phone) VALUES (?, ?, ?, ?)',
      [req.body.first, req.body.last, req.body.email, req.body.phone],
      (error, results, fields) => {
        if (error) {
          // debug(error);
          return res.status(500).send(error.sqlMessage);
        }

        //debug(results);
        req.body.id = results.insertId;
        //res.sendStatus(201);
        //debug(req);

        res.status(201)
          .location(`${req.baseUrl}/${req.body.id}`)
          .send(req.body);
      });
  });

router.route('/api/:id')
  .get((req, res, next) => {
    pool.query('SELECT * FROM contacts WHERE id = ?',
      [req.params.id],
      (error, results, fields) => {
        if (error) {
          return res.sendStatus(500);
        }
        if (!results.length) {
          return res.sendStatus(404);
        }
        res.send(results[0]);
      });
  })
  .put((req, res, next) => {
    const result = contactSchema.validate(req.body, { abortEarly: false });
    // debug(result);
    if (result.error) {
      return res.status(500).send(result.error.message);
    }

    pool.query('UPDATE contacts SET first = ?, last = ?, email = ?, phone = ?WHERE id = ?',
      [req.body.first, req.body.last, req.body.email, req.body.phone, req.params.id],
      (error, results, fields) => {
        if (error) {
          return res.sendStatus(500);
        }
        // debug(results);
        if (!results.affectedRows) {
          return res.sendStatus(404);
        }
        res.send(results[0]);
      });
  })
  .delete((req, res, next) => {
    pool.query('DELETE FROM contacts WHERE id = ?',
      [req.params.id],
      (error, results, fields) => {
        if (error) {
          return res.sendStatus(500);
        }
        //debug(results);
        if (!results.affectedRows) {
          return res.sendStatus(404);
        }

        res.sendStatus(204);
      });
  });
module.exports = router;
