import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [registerMessage, setRegisterMessage] = useState('');
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    school: '',
    program: '',
    rfid: '',
    balance: ''
  });

  const API_BASE = 'http://localhost:4000/api';

  // Load students on component mount
  useEffect(() => {
    if (currentView === 'dashboard') {
      loadStudents();
    }
  }, [currentView]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterMessage('');
    
    try {
      const response = await axios.post(`${API_BASE}/students`, formData);
      setRegisterMessage('success');
      setFormData({
        student_id: '',
        name: '',
        email: '',
        school: '',
        program: '',
        rfid: '',
        balance: ''
      });
    } catch (error) {
      setRegisterMessage(error.response?.data?.error || 'Registration failed');
    }
  };

  const searchStudent = async () => {
    if (!searchValue.trim()) {
      setSearchResults({ error: 'Please enter a Student ID or RFID' });
      return;
    }

    setSearchResults({ loading: true });
    
    try {
      const response = await axios.get(`${API_BASE}/students/${searchValue}`);
      setSearchResults({ data: response.data });
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchResults({ error: 'Student not found' });
      } else {
        setSearchResults({ error: 'Error searching for student' });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchStudent();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 to-blue-500 flex">
      {/* Sidebar */}
      <div className="w-52 bg-green-300 p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            📱
          </div>
          <div>
            <h2 className="text-gray-800 text-lg font-bold">Smart ID</h2>
            <p className="text-gray-700 text-sm">Admin Dashboard</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
              currentView === 'dashboard' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('register')}
            className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
              currentView === 'register' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Register Student
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        {currentView === 'dashboard' && (
          <div>
            {/* Stats Card */}
            <div className="bg-green-300 p-5 rounded-2xl mb-8 max-w-xs flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Total Students</h3>
                <p className="text-gray-700 text-lg">{students.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students List */}
              <div className="bg-green-300 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Recent Students</h2>
                <p className="text-gray-600 mb-5">Registered students in the system</p>
                
                <div className="bg-white p-5 rounded-xl max-h-96 overflow-y-auto">
                  {loading ? (
                    <p className="text-gray-500">Loading students...</p>
                  ) : students.length === 0 ? (
                    <p className="text-gray-500">No students registered yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {students.slice(0, 10).map((student, index) => (
                        <div 
                          key={index}
                          className="p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSearchValue(student.rfid);
                            setTimeout(() => searchStudent(), 100);
                          }}
                        >
                          <div className="font-semibold text-gray-800">{student.name}</div>
                          <div className="text-sm text-gray-600">
                            ID: {student.student_id} | {student.school}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Tap History Search */}
              <div className="bg-green-300 p-8 rounded-3xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Tap History Checker</h2>
                <p className="text-gray-600 mb-5">Search for a student to view their recent tap history</p>
                
                <div className="flex gap-3 mb-5">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter Student ID or RFID"
                    className="flex-1 p-3 rounded-full border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={searchStudent}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
                  >
                    Search
                  </button>
                </div>

                {/* Search Results */}
                {searchResults && (
                  <div>
                    {searchResults.loading ? (
                      <p className="text-gray-700">Searching...</p>
                    ) : searchResults.error ? (
                      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
                        ❌ {searchResults.error}
                      </div>
                    ) : searchResults.data ? (
                      <div className="bg-white p-5 rounded-xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">{searchResults.data.name}</h3>
                        <p className="font-semibold text-gray-700 mb-3">Recent Tap History:</p>
                        <div className="max-h-64 overflow-y-auto">
                          {searchResults.data.taps && searchResults.data.taps.length > 0 ? (
                            searchResults.data.taps.map((tap, index) => (
                              <div key={index} className="flex justify-between items-center p-3 border-b border-gray-200 last:border-b-0">
                                <span className={`font-bold ${
                                  tap.tap_type === 'entry' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {tap.tap_type.toUpperCase()}
                                </span>
                                <span className="text-gray-600 text-sm">{formatDate(tap.tap_time)}</span>
                                <span className="text-gray-800">₱{tap.user_balance}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500">No tap history found.</p>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'register' && (
          <div className="bg-green-300 p-8 rounded-3xl max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-5">Register New Student</h2>
            
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-800 font-bold mb-2">Student ID</label>
                <input
                  type="text"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  placeholder="Enter student ID"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-800 font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-800 font-bold mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-800 font-bold mb-2">School</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-800 font-bold mb-2">Course / Department</label>
                <input
                  type="text"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  placeholder="Enter course or department"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2">RFID</label>
                <input
                  type="text"
                  name="rfid"
                  value={formData.rfid}
                  onChange={handleInputChange}
                  placeholder="Scan or enter RFID"
                  required
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-bold mb-2">Initial Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full p-3 rounded-lg border-none text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full p-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors mt-5"
              >
                Register Student
              </button>
            </form>
            
            {registerMessage && (
              <div className={`mt-5 p-4 rounded-lg ${
                registerMessage === 'success' 
                  ? 'bg-green-100 border border-green-300 text-green-700' 
                  : 'bg-red-100 border border-red-300 text-red-700'
              }`}>
                {registerMessage === 'success' 
                  ? '✅ Student registered successfully!' 
                  : `❌ ${registerMessage}`
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;