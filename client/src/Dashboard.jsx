import { useEffect, useState } from "react";
import axios from "axios";
import AddReading from "./AddReading";
import EditReading from "./EditReading";
import Reports from "./Reports";

function Dashboard({ onLogout }) {
  const [readings, setReadings] = useState([]);
  const [message, setMessage] = useState("");
  const [editingReading, setEditingReading] = useState(null);
  const [showReports, setShowReports] = useState(false);

  const fetchReadings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/readings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setReadings(response.data.readings || response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to load readings"
      );
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const deleteReading = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/readings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage("Reading deleted successfully!");
      fetchReadings();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to delete reading"
      );
    }
  };

  const handleUpdated = () => {
    setEditingReading(null);
    setMessage("Reading updated successfully!");
    fetchReadings();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    if (onLogout) {
      onLogout();
    }
  };

  if (editingReading) {
    return (
      <div className="card">
        <h1>Sweety - Blood Glucose Tracker</h1>

        <EditReading
          reading={editingReading}
          onUpdated={handleUpdated}
          onCancel={() => setEditingReading(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1>Sweety - Blood Glucose Tracker</h1>

        <p>Manage your blood glucose readings</p>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="card">
        <button onClick={() => setShowReports(!showReports)}>
          {showReports ? "Hide Reports" : "View Reports"}
        </button>

        {showReports && (
          <div>
            <Reports />
          </div>
        )}
      </div>

      <div className="card">
        <AddReading onReadingAdded={fetchReadings} />
      </div>

      <div className="card">
        <h2>My Readings</h2>

        {message && <p className="success">{message}</p>}

        {readings.length === 0 ? (
          <p>No readings found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Value (mg/dl)</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {readings.map((reading) => (
                <tr key={reading.id}>
                  <td>
                    {reading.reading_date.split("T")[0]}
                  </td>

                  <td>{reading.time_slot}</td>

                  <td>{reading.value}</td>

                  <td>
                    <button
                      onClick={() => setEditingReading(reading)}
                    >
                      Edit
                    </button>

                    {" "}

                    <button
                      onClick={() => deleteReading(reading.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
