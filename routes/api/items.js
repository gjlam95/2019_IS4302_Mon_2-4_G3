const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//Item Model
const Item = require("../../models/Item");

// @route GET api/items/
// @desc  Get All Items
// @access Public
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then(items => res.json(items));
});

// @route POST api/items/
// @desc  Create an Items
// @access PRIVATE
router.post("/", auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });
  //save to DB and return back item
  newItem.save().then(item => res.json(item));
});

// @route DELETE api/items/:id
// @desc  Delete an Item
// @access PRIVATE
router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id)
    .then(item =>
      item.remove().then(() =>
        res.json({
          success: true
        })
      )
    )
    //id not found
    .catch(err =>
      res.status(404).json({
        error: err
      })
    );
});

module.exports = router;
