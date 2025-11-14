import express from 'express';
import Book from './models/books.js';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

// Registrar libro
router.post('/books', async (req, res, next) => {
    try {
        const { title, author, year, gender, stock } = req.body;
        if (!title || !author || !year || !gender || stock == null) {
            return res.status(400).json({ ok: false, message: 'Todos los campos son requeridos' });
        }
        const book = await Book.create({ title, author, year, gender, stock });
        return res.status(201).json({ ok: true, book: { id: book._id, title, author, year, gender, stock } });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ ok: false, message: 'El libro ya existe' });
        }
        return next(err);
    }
});

// Obtener todos los libros (con paginación opcional)
router.get('/books', async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page || '1', 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            Book.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Book.countDocuments()
        ]);
        return res.json({
            ok: true,
            page,
            limit,
            total,
            items: items.map((b) => ({
                id: b._id,
                title: b.title,
                author: b.author,
                year: b.year,
                gender: b.gender,
                stock: b.stock
            }))
        });
    } catch (err) {
        return next(err);
    }
});

// Obtener un libro por id
router.get('/books/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ ok: false, message: 'ID inválido' });
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ ok: false, message: 'Libro no encontrado' });
        return res.json({ ok: true, book: { id: book._id, title: book.title, author: book.author, year: book.year, gender: book.gender, stock: book.stock } });
    } catch (err) {
        return next(err);
    }
});

// Leer un libro (ruta específica)
router.get('/books/:id/read', async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ ok: false, message: 'ID inválido' });
        const book = await Book.findById(id);
        if (!book) return res.status(404).json({ ok: false, message: 'Libro no encontrado' });
        return res.json({ ok: true });
    } catch (err) {
        return next(err);
    }
});

// **Exportar el router correctamente**
export default router;
