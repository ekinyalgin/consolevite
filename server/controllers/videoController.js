const db = require('../config/db'); 

exports.getVideos = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // Varsayılan olarak 10
    const offset = parseInt(req.query.offset) || 0; // Varsayılan olarak 0

    try {
        const [rows] = await db.query('SELECT * FROM videos ORDER BY done DESC, id DESC LIMIT ? OFFSET ?', [limit, offset]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addVideo = async (req, res) => {
    const { title, url, note } = req.body;
    try {
        const [result] = await db.query('INSERT INTO videos (title, url, note) VALUES (?, ?, ?)', [title, url, note]);
        res.json({ id: result.insertId, title, url, note, done: 0, created_at: new Date() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// videoController.js
exports.updateVideo = async (req, res) => {
    const { id } = req.params;
    const { title, url, note, done } = req.body; 

    try {
        await db.query('UPDATE videos SET title = ?, url = ?, note = ?, done = ? WHERE id = ?', [title, url, note, done, id]);
        res.json({ id, title, url, note, done });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.deleteVideo = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM videos WHERE id = ?', [id]);
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
