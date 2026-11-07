const pool = require("../config/db");

const getDailyReport = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Date is required"
            });
        }

        const result = await pool.query(
            `SELECT
                id,
                reading_date::text AS reading_date,
                time_slot,
                value
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2
             ORDER BY
                CASE time_slot
                    WHEN 'Morning' THEN 1
                    WHEN 'After breakfast' THEN 2
                    WHEN 'After lunch' THEN 3
                    WHEN 'After dinner' THEN 4
                END`,
            [user_id, date]
        );

        const stats = await pool.query(
            `SELECT
                COUNT(*)::int AS count,
                MAX(value)::int AS highest,
                MIN(value)::int AS lowest,
                ROUND(AVG(value), 1) AS average
             FROM readings
             WHERE user_id = $1
             AND reading_date = $2`,
            [user_id, date]
        );

        res.json({
            count: stats.rows[0].count,
            highest: stats.rows[0].highest,
            lowest: stats.rows[0].lowest,
            average: stats.rows[0].average,
            readings: result.rows
        });

    } catch (error) {
        console.error("Daily report error:", error.message);

        res.status(500).json({
            message: "Failed to generate daily report"
        });
    }
};

const getMonthToDateReport = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT
                COUNT(*)::int AS count,
                MAX(value)::int AS highest,
                MIN(value)::int AS lowest,
                ROUND(AVG(value), 1) AS average
             FROM readings
             WHERE user_id = $1
             AND reading_date >= DATE_TRUNC('month', CURRENT_DATE)::date
             AND reading_date <= CURRENT_DATE`,
            [user_id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Month-to-date report error:", error.message);

        res.status(500).json({
            message: "Failed to generate month-to-date report"
        });
    }
};

const getPreviousMonthReport = async (req, res) => {
    try {
        const user_id = req.user.id;

        const result = await pool.query(
            `SELECT
                COUNT(*)::int AS count,
                MAX(value)::int AS highest,
                MIN(value)::int AS lowest,
                ROUND(AVG(value), 1) AS average
             FROM readings
             WHERE user_id = $1
             AND reading_date >=
                 (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month')::date
             AND reading_date <
                 DATE_TRUNC('month', CURRENT_DATE)::date`,
            [user_id]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Previous month report error:", error.message);

        res.status(500).json({
            message: "Failed to generate previous month report"
        });
    }
};

module.exports = {
    getDailyReport,
    getMonthToDateReport,
    getPreviousMonthReport
};
