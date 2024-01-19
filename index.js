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
    app.use(express.json());

    await mongoose.connect(process.env.DB_URL);
    const itemSchema = new mongoose.Schema({
        pdb_text: String,
        pdb_sequence: String,
        pdb_anotations:[]
    });
    const Item = mongoose.model('Item', itemSchema);


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


    app.post('/items', async (req, res) => {
        const { pdb_text, pdb_sequence ,pdb_anotations } = req.body;

        try {
            const newItem = new Item({ pdb_text, pdb_sequence ,pdb_anotations});
            await newItem.save();
            res.status(201).json(newItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



    app.put('/items/:id', async (req, res) => {
        const itemId = req.params.id;
        const { pdb_text, pdb_sequence,pdb_anotations } = req.body;

        try {
            const updatedItem = await Item.findByIdAndUpdate(itemId, { pdb_text, pdb_sequence,pdb_anotations }, { new: true });
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(updatedItem);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    }
    );
}
