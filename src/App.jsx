import { useEffect, useMemo, useState } from 'react';
import { buildDemoState, LANGUAGE_OPTIONS } from './data/syntheticData';
import { loadAppState, saveAppState } from './lib/storage';
import { getDemoTranslation, getLanguageMeta, readAloud } from './lib/bhasini';

const formatDate = (value) => {
  if (!value) return 'Not available';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

const getPatientById = (patients, patientId) => patients.find((patient) => patient.id === patientId) || null;

// Mock hospital/clinic data
const HOSPITALS = [
  {
    id: 'H1',
    name: 'City Medical Center',
    doctors: [
      { id: 'D1', name: 'Dr. Aditi Nair', specialty: 'Family Medicine' },
      { id: 'D2', name: 'Dr. Rohan Iyer', specialty: 'Cardiology' },
    ],
    vaccinations: [
      { id: 'V1', name: 'COVID-19 (1st dose)', date: '2024-03-15' },
      { id: 'V2', name: 'Influenza', date: '2024-09-20' },
    ],
    tests: [
      { id: 'T1', name: 'Blood Test', date: '2024-10-01', result: 'Normal' },
      { id: 'T2', name: 'ECG', date: '2024-09-10', result: 'Normal' },
    ],
  },
  {
    id: 'H2',
    name: 'Hope Hospital',
    doctors: [
      { id: 'D3', name: 'Dr. Sanjay Patel', specialty: 'Pediatrics' },
    ],
    vaccinations: [
      { id: 'V3', name: 'Polio', date: '2024-04-10' },
    ],
    tests: [
      { id: 'T3', name: 'Thyroid Panel', date: '2024-08-15', result: 'Normal' },
    ],
  },
  {
    id: 'H3',
    name: 'Elite Care Clinic',
    doctors: [
      { id: 'D4', name: 'Dr. Priya Sharma', specialty: 'Dermatology' },
    ],
    vaccinations: [
      { id: 'V4', name: 'Tetanus', date: '2024-02-05' },
    ],
    tests: [
      { id: 'T4', name: 'Skin Biopsy', date: '2024-07-20', result: 'Benign' },
    ],
  },
];

function App() {
  const [appState, setAppState] = useState(() => loadAppState() || buildDemoState());
  const [loginMode, setLoginMode] = useState('patient');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState('');
  const [fontScale, setFontScale] = useState(1);
  const [sosTimer, setSosTimer] = useState(30);
  const [sosActive, setSosActive] = useState(false);

  const [newAllergyInput, setNewAllergyInput] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('H1');

  const currentLanguageCode = appState.language || 'en';
  const currentUser = appState.currentUser;

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!sosActive) return undefined;
    const interval = setInterval(() => {
      setSosTimer((previous) => (previous <= 1 ? 0 : previous - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [sosActive]);

  const patientList = appState.patients || [];
  const staffList = appState.staff || [];
  const appointmentList = appState.appointments || [];
  const requestList = appState.medicalCardRequests || [];
  const sosAlerts = appState.sosAlerts || [];

  const displayName = currentUser ? (currentUser.fullName || currentUser.name || 'Guest') : 'Guest';

  const t = (key, fallback) => getDemoTranslation(key, currentLanguageCode) || fallback || key;

  const handleLogout = () => {
    setAppState((previous) => ({ ...previous, currentUser: null }));
    setToast('Logged out successfully');
    setActiveTab('overview');
  };

  const handleLogin = (event) => {
    event.preventDefault();

    const patientMatch = patientList.find(
      (patient) => patient.username === loginForm.username && patient.password === loginForm.password,
    );

    if (patientMatch) {
      setAppState((previous) => ({ ...previous, currentUser: patientMatch }));
      setToast('Login successful');
      setActiveTab('overview');
      return;
    }

    const staffMatch = staffList.find(
      (member) => member.username === loginForm.username && member.password === loginForm.password,
    );

    if (staffMatch) {
      setAppState((previous) => ({ ...previous, currentUser: staffMatch }));
      setToast('Login successful');
      setActiveTab('overview');
      return;
    }

    setToast('Invalid login credentials');
  };

  const handleAddAllergy = () => {
    const trimmed = newAllergyInput.trim();
    if (!trimmed) {
      setToast('Please enter an allergy');
      return;
    }

    const allergies = currentUser.allergies || [];
    if (allergies.includes(trimmed)) {
      setToast('This allergy is already added');
      return;
    }

    const updated = { ...currentUser, allergies: [...allergies, trimmed] };
    setAppState((previous) => ({
      ...previous,
      currentUser: updated,
      patients: previous.patients.map((p) => (p.id === currentUser.id ? updated : p)),
    }));

    setNewAllergyInput('');
    setToast(`Allergy "${trimmed}" added`);
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    const updated = {
      ...currentUser,
      allergies: (currentUser.allergies || []).filter((a) => a !== allergyToRemove),
    };
    setAppState((previous) => ({
      ...previous,
      currentUser: updated,
      patients: previous.patients.map((p) => (p.id === currentUser.id ? updated : p)),
    }));
    setToast(`Allergy "${allergyToRemove}" removed`);
  };

  const handleSosActivate = () => {
    if (!currentUser) return;
    setSosActive(true);
    setSosTimer(30);
    setAppState((previous) => ({
      ...previous,
      sosAlerts: [
        {
          id: `SOS_${Date.now()}`,
          patientId: currentUser.id,
          patientName: currentUser.fullName || currentUser.name || 'Patient',
          text: 'Local safety alert activated. No emergency service is connected yet.',
          timestamp: new Date().toISOString(),
        },
        ...previous.sosAlerts,
      ],
    }));
  };

  const handleSafe = () => {
    setSosActive(false);
    setSosTimer(30);
    setToast('Local SOS alert cleared');
  };

  if (!currentUser) {
    return (
      <div className="app-shell">
        <div className="auth-page">
          <div className="auth-card" aria-labelledby="app-title">
            <div className="brand-block">
              <div className="brand-icon" aria-hidden="true">✚</div>
              <div>
                <div className="eyebrow">CareBridge</div>
                <h1 id="app-title">Accessible care coordination</h1>
              </div>
            </div>

            <div className="demo-banner" role="status" aria-live="polite">
              {t('demoNote', 'Demo authentication is enabled for prototype testing.')}
            </div>

            <div className="role-selector" aria-label={t('loginMode', 'Select access mode')}>
              <button
                type="button"
                className={loginMode === 'patient' ? 'selected' : ''}
                onClick={() => setLoginMode('patient')}
              >
                👤 Patient
              </button>
              <button
                type="button"
                className={loginMode === 'staff' ? 'selected' : ''}
                onClick={() => setLoginMode('staff')}
              >
                🏥 Staff
              </button>
            </div>

            <form onSubmit={handleLogin} className="auth-form">
              <label>
                Username
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((previous) => ({ ...previous, username: event.target.value }))}
                  placeholder="Enter username"
                  aria-label="Username"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((previous) => ({ ...previous, password: event.target.value }))}
                  placeholder="Enter password"
                  aria-label="Password"
                />
              </label>

              <button className="primary-btn" type="submit">Log In</button>
            </form>
          </div>
        </div>

        {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      </div>
    );
  }

  const selectedHospitalData = HOSPITALS.find((h) => h.id === selectedHospital) || HOSPITALS[0];

  if (currentUser.role === 'staff') {
    return (
      <div className="app-shell">
        <header className="top-header">
          <div className="header-left">
            <div className="header-brand">
              <span className="brand-icon">HB</span>
              <div>
                <h1>CareBridge</h1>
                <p>Care Team Dashboard</p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn" onClick={() => setFontScale((p) => Math.max(p - 0.1, 0.9))}>A-</button>
            <button className="header-btn" onClick={() => setFontScale((p) => Math.min(p + 0.1, 1.4))}>A+</button>
            <select
              value={currentLanguageCode}
              onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}
              className="header-select"
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language.code} value={language.code}>{language.name}</option>
              ))}
            </select>
            <button className="header-btn danger" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="dashboard-content">
          <div className="sidebar">
            <div className="user-card">
              <div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div>
              <div>
                <h3>{displayName}</h3>
                <p>Care Staff</p>
              </div>
            </div>

            <nav className="nav-menu">
              <button className={activeTab === 'patients' ? 'active' : ''} onClick={() => setActiveTab('patients')}>
                📋 Patient Records
              </button>
              <button className={activeTab === 'approvals' ? 'active' : ''} onClick={() => setActiveTab('approvals')}>
                ✓ Access Approvals
              </button>
              <button className={activeTab === 'sos' ? 'active' : ''} onClick={() => setActiveTab('sos')}>
                🚨 SOS Alerts
              </button>
            </nav>
          </div>

          <div className="main-content">
            {activeTab === 'patients' && (
              <div className="card">
                <h2>Patient Records</h2>
                <div className="table-responsive">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Blood Group</th>
                        <th>Allergies</th>
                        <th>Chronic Conditions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientList.map((patient) => (
                        <tr key={patient.id}>
                          <td><strong>{patient.fullName}</strong></td>
                          <td>{patient.bloodGroup}</td>
                          <td>{patient.allergies?.join(', ') || 'None'}</td>
                          <td>{patient.chronicConditions?.join(', ') || 'None'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="card">
                <h2>Pending Access Requests</h2>
                {requestList.filter((r) => r.status === 'Pending').length === 0 ? (
                  <p className="empty-state">No pending requests</p>
                ) : (
                  <div className="request-list">
                    {requestList.filter((r) => r.status === 'Pending').map((request) => (
                      <div key={request.id} className="request-item">
                        <div>
                          <strong>{request.patientName}</strong>
                          <p>Card: {request.requestedCardId}</p>
                          <p className="muted">Requested: {formatDate(request.requestedAt)}</p>
                        </div>
                        <button className="btn-success">Approve</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sos' && (
              <div className="card">
                <h2>Local SOS Alerts</h2>
                {sosAlerts.length === 0 ? (
                  <p className="empty-state">No active alerts</p>
                ) : (
                  <div className="sos-list">
                    {sosAlerts.map((alert) => (
                      <div key={alert.id} className="sos-item">
                        <strong>{alert.patientName}</strong>
                        <p>{alert.text}</p>
                        <p className="muted">{formatDate(alert.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="header-left">
          <div className="header-brand">
            <span className="brand-icon">HB</span>
            <div>
              <h1>CareBridge</h1>
              <p>Patient Portal</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="header-btn" onClick={() => setFontScale((p) => Math.max(p - 0.1, 0.9))}>A-</button>
          <button className="header-btn" onClick={() => setFontScale((p) => Math.min(p + 0.1, 1.4))}>A+</button>
          <select
            value={currentLanguageCode}
            onChange={(event) => setAppState((previous) => ({ ...previous, language: event.target.value }))}
            className="header-select"
          >
            {LANGUAGE_OPTIONS.map((language) => (
              <option key={language.code} value={language.code}>{language.name}</option>
            ))}
          </select>
          <button className="header-btn danger" onClick={handleSosActivate}>🚨 SOS</button>
          <button className="header-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <div className="user-card">
            <div className="avatar">{displayName.slice(0, 1).toUpperCase()}</div>
            <div>
              <h3>{displayName}</h3>
              <p>{currentUser.bloodGroup} • {currentUser.preferredLanguage}</p>
            </div>
          </div>

          <nav className="nav-menu">
            <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
              📊 Overview
            </button>
            <button className={activeTab === 'records' ? 'active' : ''} onClick={() => setActiveTab('records')}>
              🏥 Medical Card
            </button>
            <button className={activeTab === 'hospitals' ? 'active' : ''} onClick={() => setActiveTab('hospitals')}>
              🏛️ Hospital Records
            </button>
            <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
              📅 Appointments
            </button>
          </nav>

          <div className="summary-card">
            <h4>Summary</h4>
            <ul>
              <li>🚨 {currentUser.allergies?.length || 0} allergies</li>
              <li>💊 {currentUser.chronicConditions?.length || 0} conditions</li>
              <li>💉 {currentUser.currentMedications?.length || 0} medications</li>
            </ul>
          </div>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="card">
              <h2>Patient Overview</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{currentUser.fullName}</p>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <p>{formatDate(currentUser.dob)}</p>
                </div>
                <div className="info-item">
                  <label>Blood Group</label>
                  <p>{currentUser.bloodGroup}</p>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <p>{currentUser.gender}</p>
                </div>
                <div className="info-item">
                  <label>Emergency Contact</label>
                  <p>{currentUser.emergencyContact}</p>
                </div>
                <div className="info-item">
                  <label>Emergency Number</label>
                  <p>{currentUser.emergencyContactNumber}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="card">
              <h2>Medical Card</h2>

              <div className="section">
                <h3>Allergies</h3>
                <div className="allergy-section">
                  <div className="allergy-tags">
                    {(currentUser.allergies || []).length === 0 ? (
                      <p className="empty-state">No allergies recorded</p>
                    ) : (
                      (currentUser.allergies || []).map((allergy) => (
                        <div key={allergy} className="allergy-tag">
                          {allergy}
                          <button
                            type="button"
                            className="tag-remove"
                            onClick={() => handleRemoveAllergy(allergy)}
                            aria-label={`Remove ${allergy}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="add-allergy">
                    <input
                      type="text"
                      value={newAllergyInput}
                      onChange={(e) => setNewAllergyInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddAllergy()}
                      placeholder="Type allergy name..."
                      aria-label="Add new allergy"
                    />
                    <button type="button" onClick={handleAddAllergy} className="btn-primary">
                      ➕ Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="section">
                <h3>Chronic Conditions</h3>
                <p>{(currentUser.chronicConditions || []).join(', ') || 'None recorded'}</p>
              </div>

              <div className="section">
                <h3>Current Medications</h3>
                <p>{(currentUser.currentMedications || []).join(', ') || 'None recorded'}</p>
              </div>
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="card">
              <h2>Hospital & Clinic Records</h2>

              <label htmlFor="hospital-select" className="label-select">Select Hospital/Clinic:</label>
              <select
                id="hospital-select"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="hospital-select"
              >
                {HOSPITALS.map((h) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>

              {selectedHospitalData && (
                <>
                  <div className="section">
                    <h3>👨‍⚕️ Doctors at {selectedHospitalData.name}</h3>
                    {selectedHospitalData.doctors.length === 0 ? (
                      <p className="empty-state">No doctors recorded</p>
                    ) : (
                      <table className="records-table">
                        <thead>
                          <tr>
                            <th>Doctor Name</th>
                            <th>Specialty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedHospitalData.doctors.map((doctor) => (
                            <tr key={doctor.id}>
                              <td>{doctor.name}</td>
                              <td>{doctor.specialty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="section">
                    <h3>💉 Vaccinations</h3>
                    {selectedHospitalData.vaccinations.length === 0 ? (
                      <p className="empty-state">No vaccinations recorded</p>
                    ) : (
                      <table className="records-table">
                        <thead>
                          <tr>
                            <th>Vaccination</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedHospitalData.vaccinations.map((vac) => (
                            <tr key={vac.id}>
                              <td>{vac.name}</td>
                              <td>{formatDate(vac.date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  <div className="section">
                    <h3>🧪 Tests & Results</h3>
                    {selectedHospitalData.tests.length === 0 ? (
                      <p className="empty-state">No tests recorded</p>
                    ) : (
                      <table className="records-table">
                        <thead>
                          <tr>
                            <th>Test Name</th>
                            <th>Date</th>
                            <th>Result</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedHospitalData.tests.map((test) => (
                            <tr key={test.id}>
                              <td>{test.name}</td>
                              <td>{formatDate(test.date)}</td>
                              <td className="result-success">{test.result}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="card">
              <h2>Your Appointments</h2>
              {appointmentList.filter((a) => a.patientId === currentUser.id).length === 0 ? (
                <p className="empty-state">No appointments scheduled</p>
              ) : (
                <div className="appointments-list">
                  {appointmentList.filter((a) => a.patientId === currentUser.id).map((apt) => (
                    <div key={apt.id} className="appointment-item">
                      <div className="apt-time">{apt.time}</div>
                      <div className="apt-details">
                        <strong>{apt.doctorName}</strong>
                        <p>{apt.specialty}</p>
                        <p className="muted">{formatDate(apt.date)}</p>
                      </div>
                      <span className={`status ${apt.status.toLowerCase()}`}>{apt.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {sosActive && (
        <div className="sos-overlay" role="alertdialog" aria-modal="true">
          <div className="sos-card">
            <h2>🚨 Local SOS Active</h2>
            <p>No emergency service is connected yet.</p>
            <div className="sos-timer">{sosTimer}s</div>
            <button className="btn-success" onClick={handleSafe}>✓ I AM SAFE</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
