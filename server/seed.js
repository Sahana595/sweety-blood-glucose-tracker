const bcrypt = require("bcrypt");
const pool = require("./config/db");

const seed = async () => {
    try {
        const passwordHash = await bcrypt.hash("Demo@12345", 10);

        const userResult = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             ON CONFLICT (email)
             DO UPDATE SET name = EXCLUDED.name
             RETURNING id`,
            ["Demo User", "demo@example.com", passwordHash]
        );

        const userId = userResult.rows[0].id;

        await pool.query(
            `DELETE FROM readings
             WHERE user_id = $1`,
            [userId]
        );

        await pool.query(
            `INSERT INTO readings
             (user_id, reading_date, time_slot, value)
             VALUES
             ($1, CURRENT_DATE, 'Morning', 95),
             ($1, CURRENT_DATE, 'After breakfast', 128),
             ($1, CURRENT_DATE, 'After lunch', 142),
             ($1, CURRENT_DATE, 'After dinner', 120)`,
            [userId]
        );

        console.log("Demo user and sample readings created successfully.");
        console.log("Email: demo@example.com");
        console.log("Password: Demo@12345");

    } catch (error) {
        console.error("Seed error:", error.message);
    } finally {
        await pool.end();
    }
};

seed();