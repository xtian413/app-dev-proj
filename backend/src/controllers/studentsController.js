import sql from '../config/db.js';

export async function getAllStudents(req, res) {
  try {
    const students = await sql`SELECT * FROM users`;
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'An error occurred while fetching students.' });
  }
}

export async function getStudentByRfid(req, res) {
  try {
    const { rfid } = req.params;
    const studentResult = await sql`SELECT name FROM users WHERE rfid = ${rfid}`;

    if (studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const studentProfile = studentResult[0];
    const tapsHistory = await sql`
      SELECT tap_type, tap_time, user_balance 
      FROM taps 
      WHERE rfid = ${rfid}
      ORDER BY tap_time DESC
    `;

    res.status(200).json({
      ...studentProfile,
      taps: tapsHistory,
    });
  } catch (err) {
    console.error('Error fetching student data by RFID:', err);
    res.status(500).json({ error: 'An error occurred while fetching the student data.' });
  }
}
