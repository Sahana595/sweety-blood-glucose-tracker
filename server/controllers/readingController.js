const pool = require("../config/db");

const createReading = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { reading_date, time_slot, value } = req.body;

        if (!reading_date || !time_slot || value === undefined) {
            return res.status(400).json({
                message: "Date, time slot and value are required"
            });
        }

        const validSlots = [
            "Morning",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot"
            });
        }

        if (!Number.isInteger(Number(value))) {
            return res.status(400).json({
                message: "Glucose value must be a whole number"
            });
        }

        if (Number(value) < 40 || Number(value) > 600) {
            return res.status(400).json({
                message: "Glucose value must be between 40 and 600"
            });
        }

        const today = new Date().toISOString().split("T")[0];

        if (reading_date > today) {
            return res.status(400).json({
                message: "Future date is not allowed"
            });
        }

        const duplicate = await pool.query(
            `SELECT id
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2
             AND time_slot = $3`,
            [user_id, reading_date, time_slot]
        );

        if (duplicate.rows.length > 0) {
            return res.status(400).json({
                message: "A reading already exists for this date and time slot"
            });
        }

        const result = await pool.query(
            `INSERT INTO readings
             (user_id, reading_date, time_slot, value)
             VALUES ($1, $2, $3, $4)
             RETURNING
                id,
                user_id,
                reading_date::text AS reading_date,
                time_slot,
                value,
                created_at,
                updated_at`,
            [user_id, reading_date, time_slot, Number(value)]
        );

        res.status(201).json({
            message: "Reading added successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        console.error("Create reading error:", error.message);

        res.status(500).json({
            message: "Failed to create reading"
        });
    }
};

const getReadings = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT
                id,
                user_id,
                reading_date::text AS reading_date,
                time_slot,
                value,
                created_at,
                updated_at
             FROM readings
             WHERE user_id = $1
             ORDER BY reading_date DESC, id DESC`,
            [user_id]
        );

        res.json({
            readings: result.rows
        });

    } catch (error) {
        console.error("Get readings error:", error.message);

        res.status(500).json({
            message: "Failed to fetch readings"
        });
    }
};

const updateReading = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        const { reading_date, time_slot, value } = req.body;

        if (!reading_date || !time_slot || value === undefined) {
            return res.status(400).json({
                message: "Date, time slot and value are required"
            });
        }

        const validSlots = [
            "Morning",
            "After breakfast",
            "After lunch",
            "After dinner"
        ];

        if (!validSlots.includes(time_slot)) {
            return res.status(400).json({
                message: "Invalid time slot"
            });
        }

        if (!Number.isInteger(Number(value))) {
            return res.status(400).json({
                message: "Glucose value must be a whole number"
            });
        }

        if (Number(value) < 40 || Number(value) > 600) {
            return res.status(400).json({
                message: "Glucose value must be between 40 and 600"
            });
        }

        const today = new Date().toISOString().split("T")[0];

        if (reading_date > today) {
            return res.status(400).json({
                message: "Future date is not allowed"
            });
        }

        const existing = await pool.query(
            `SELECT id
             FROM readings
             WHERE id = $1 AND user_id = $2`,
            [id, user_id]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        const duplicate = await pool.query(
            `SELECT id
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2
             AND time_slot = $3
             AND id != $4`,
            [user_id, reading_date, time_slot, id]
        );

        if (duplicate.rows.length > 0) {
            return res.status(400).json({
                message: "A reading already exists for this date and time slot"
            });
        }

        const result = await pool.query(
            `UPDATE readings
             SET reading_date = $1,
                 time_slot = $2,
                 value = $3,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $4 AND user_id = $5
             RETURNING
                id,
                user_id,
                reading_date::text AS reading_date,
                time_slot,
                value,
                created_at,
                updated_at`,
            [reading_date, time_slot, Number(value), id, user_id]
        );

        res.json({
            message: "Reading updated successfully!",
            reading: result.rows[0]
        });

    } catch (error) {
        console.error("Update reading error:", error.message);

        res.status(500).json({
            message: "Failed to update reading"
        });
    }
};

const deleteReading = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM readings
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.json({
            message: "Reading deleted successfully!"
        });

    } catch (error) {
        console.error("Delete reading error:", error.message);

        res.status(500).json({
            message: "Failed to delete reading"
        });
    }
};

module.exports = {
    createReading,
    getReadings,
    updateReading,
    deleteReading
};
