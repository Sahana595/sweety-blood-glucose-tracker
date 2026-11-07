import { useState } from "react";
import axios from "axios";

function EditReading({ reading, onUpdated, onCancel }) {
  const [date, setDate] = useState(
    reading.reading_date.split("T")[0]
  );
  const [timeSlot, setTimeSlot] = useState(reading.time_slot);
  const [value, setValue] = useState(String(reading.value));
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
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

      const response = await axios.put(
        `http://localhost:5000/api/readings/${reading.id}`,
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
        response.data.message || "Reading updated successfully!"
      );

      if (onUpdated) {
        onUpdated();
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to update reading"
      );
    }
  };

  return (
    <div>
      <h3>Edit Reading</h3>

      <form onSubmit={handleUpdate}>

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

        <button type="submit">
          Update
        </button>

        {" "}

        <button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>

      </form>

      <p>{message}</p>
    </div>
  );
}

export default EditReading;
