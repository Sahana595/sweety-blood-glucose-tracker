import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [daily, setDaily] = useState(null);
  const [monthToDate, setMonthToDate] = useState(null);
  const [previousMonth, setPreviousMonth] = useState(null);
  const [message, setMessage] = useState("");

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const today = getToday();

      const [dailyResponse, monthResponse, previousResponse] =
        await Promise.all([
          axios.get(
            `http://localhost:5000/api/reports/daily?date=${today}`,
            { headers }
          ),
          axios.get(
            "http://localhost:5000/api/reports/month-to-date",
            { headers }
          ),
          axios.get(
            "http://localhost:5000/api/reports/previous-month",
            { headers }
          )
        ]);

      setDaily(dailyResponse.data);
      setMonthToDate(monthResponse.data);
      setPreviousMonth(previousResponse.data);

    } catch (error) {
      console.error("REPORT ERROR:", error.response);

      setMessage(
        error.response?.data?.message ||
        "Failed to load reports"
      );
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const ReportStats = ({ report }) => (
    <div>
      <p>Count: {report.count}</p>
      <p>Highest: {report.highest ?? "N/A"}</p>
      <p>Lowest: {report.lowest ?? "N/A"}</p>
      <p>Average: {report.average ?? "N/A"}</p>
    </div>
  );

  return (
    <div>
      <h2>Reports</h2>

      {message && <p>{message}</p>}

      <h3>Daily Report - {daily?.date}</h3>

      {daily ? (
        <div>
          <ReportStats report={daily} />

          {daily.readings && daily.readings.length > 0 ? (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Value (mg/dl)</th>
                </tr>
              </thead>

              <tbody>
                {daily.readings.map((reading) => (
                  <tr key={reading.id}>
                    <td>{reading.reading_date}</td>
                    <td>{reading.time_slot}</td>
                    <td>{reading.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No readings found for today.</p>
          )}
        </div>
      ) : (
        <p>Loading daily report...</p>
      )}

      <hr />

      <h3>Month-to-Date Report</h3>

      {monthToDate ? (
        <ReportStats report={monthToDate} />
      ) : (
        <p>Loading month-to-date report...</p>
      )}

      <hr />

      <h3>Previous Month Report</h3>

      {previousMonth ? (
        <ReportStats report={previousMonth} />
      ) : (
        <p>Loading previous month report...</p>
      )}
    </div>
  );
}

export default Reports;
