import { useState } from "react";
import axios from "axios";

function AddReading({ onReadingAdded }) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Morning");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!date) {
      setMessage("Date is required");
      return;
    }

    const today = new Date();
    const todayString =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    if (date > todayString) {
      setMessage("Future date is not allowed");
      return;
    }

    if (value === "") {
      setMessage("Glucose value is required");
      return;
    }

    if (!Number.isInteger(Number(value))) {
      setMessage("Glucose value must be a whole number");
      return;
    }

    if (Number(value) < 40 || Number(value) > 600) {
      setMessage("Glucose value must be between 40 and 600");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/readings",
        {
          reading_date: date,
          time_slot: timeSlot,
          value: Number(value)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(
        response.data.message || "Reading added successfully!"
      );

      setDate("");
      setValue("");

      if (onReadingAdded) {
        onReadingAdded();
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to add reading"
      );
    }
  };

  return (
    <div>
      <h2 className="section-title">Add Blood Glucose Reading</h2>
<p className="section-description">
  Record your blood glucose level for today or a previous date.
</p>

      <form onSubmit={handleSubmit}>

        <label>Date:</label>
        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br /><br />

        <label>Time Slot:</label>
        <br />

        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option>Morning</option>
          <option>After breakfast</option>
          <option>After lunch</option>
          <option>After dinner</option>
        </select>

        <br /><br />

        <label>Glucose Value (mg/dl):</label>
        <br />

        <input
          type="number"
          min="40"
          max="600"
          step="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <br /><br />

        <button type="submit">Add Reading</button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default AddReading;
