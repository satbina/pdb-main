const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
require('dotenv').config();


const app = express();
a();
async function a() {
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.use(express.static(path.join(__dirname, 'public')));

    await mongoose.connect(process.env.DB_URL);

    // Create a Mongoose Schema
    const itemSchema = new mongoose.Schema({
        pdb_text: String,
        pdb_sequence: String,
    });

    // Create a Mongoose Model
    const Item = mongoose.model('Item', itemSchema);

    // Middleware to parse JSON
    app.use(express.json());

    // Route to get all items
    app.get('/items', async (req, res) => {
        try {
            const items = await Item.find();
            res.json(items);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to get a specific item by ID
    app.get('/items/:id', async (req, res) => {
        const itemId = req.params.id;

        try {
            const item = await Item.findById(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to create a new item
    app.post('/items', async (req, res) => {
        const { pdb_text, pdb_sequence } = req.body;

        try {
            const newItem = new Item({ pdb_text, pdb_sequence });
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to update an existing item by ID
    app.put('/items/:id', async (req, res) => {
        const itemId = req.params.id;
        const { pdb_text, pdb_sequence } = req.body;

        try {
            const updatedItem = await Item.findByIdAndUpdate(itemId, { pdb_text, pdb_sequence }, { new: true });
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Route to delete an item by ID
    app.delete('/items/:id', async (req, res) => {
        const itemId = req.params.id;

        try {
            const deletedItem = await Item.findByIdAndDelete(itemId);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    }
    );
}
