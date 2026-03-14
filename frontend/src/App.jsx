import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Goal 5: Analytics Data for 6th Sem Subjects
  const [attendanceData] = useState([
    { subject: 'CD', percentage: 78, faculty: 'Ms. Mrigana Walia' },
    { subject: 'AI', percentage: 85, faculty: 'Ms. Nidhi' },
    { subject: 'CC', percentage: 92, faculty: 'Dr. Rajesh' },
    { subject: 'ML', percentage: 65, faculty: 'Ms. Rashmi' },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tRes = await axios.get(`${API_BASE}/timetable/`);
      setTimetable(tRes.data);
      const nRes = await axios.get(`${API_BASE}/notices/`);
      setNotices(nRes.data);
    } catch (err) {
      console.error("Backend offline");
    }
  };

  // Goal 1 & 7: Export to PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Quest Group - B.Tech CSE 6th Sem Timetable", 14, 15);
    doc.autoTable({
      startY: 20,
      head: [['Day', 'Time', 'Subject', 'Room']],
      body: timetable.map(t => [t.day, t.time_slot, t.subject, t.room_id]),
    });
    doc.save("Quest_Timetable.pdf");
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7f9', minHeight: '100vh', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center', color: '#1a73e8' }}>Quest Group Smart ERP</h1>

      {/* Goal 5: Analytics Dashboard */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <h3>📊 Attendance Trends (6th Sem)</h3>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="percentage" fill="#1a73e8" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Goal 2: Assignment Module */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
          <h3>📝 Submit Assignment</h3>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ marginBottom: '15px' }} />
          <button style={btnStyle} onClick={() => alert("File Uploaded to uploads/assignments")}>
            Upload to Faculty
          </button>
        </div>

        {/* Goal 1: Smart Schedule */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>📅 Weekly Schedule</h3>
            <button onClick={downloadPDF} style={{ backgroundColor: '#fb8c00', color: 'white', padding: '5px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Download PDF
            </button>
          </div>
          <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#f8f9fa' }}><th>Day</th><th>Time</th><th>Subject</th></tr></thead>
            <tbody>
              {timetable.map(t => <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{t.day}</td><td>{t.time_slot}</td><td>{t.subject}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default App;