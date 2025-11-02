import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAuth, 
  sendPasswordResetEmail, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  deleteUser 
} from 'firebase/auth';

const Settings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [resetFeedback, setResetFeedback] = useState('');
  const [deleteFeedback, setDeleteFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Fungsi untuk Reset Password ---
  const handlePasswordReset = async () => {
    setResetFeedback('');
    if (!user) {
      setResetFeedback('Error: No user is logged in.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetFeedback(`Success! A password reset email has been sent to ${user.email}.`);
    } catch (err) {
      setResetFeedback('Error: ' + err.message);
      console.error(err);
    }
  };

  // --- Fungsi untuk Delete Account ---
  const handleDeleteAccount = async () => {
    setDeleteFeedback('');
    setLoading(true);

    if (!user) {
      setDeleteFeedback('Error: No user is logged in.');
      setLoading(false);
      return;
    }

    // 1. Konfirmasi pertama (apakah mereka yakin?)
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      setLoading(false);
      return;
    }

    // 2. Dapatkan password untuk re-autentikasi (WAJIB untuk keamanan)
    const password = window.prompt('To delete your account, please enter your password:');
    if (!password) {
      setDeleteFeedback('Password entry cancelled. Account not deleted.');
      setLoading(false);
      return;
    }

    try {
      // 3. Buat kredensial
      const credential = EmailAuthProvider.credential(user.email, password);

      // 4. Re-autentikasi pengguna
      await reauthenticateWithCredential(user, credential);

      // 5. Jika re-autentikasi berhasil, HAPUS pengguna
      await deleteUser(user);
      
      // 6. Arahkan ke halaman login (karena pengguna sudah tidak ada)
      navigate('/login');

    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setDeleteFeedback('Error: Wrong password. Account not deleted.');
      } else {
        setDeleteFeedback('Error: ' + err.message);
      }
      console.error(err);
    }
    
    setLoading(false);
  };

  return (
    <div className="settings-page">
      <div className="form-container">
        <h2>User Settings</h2>
        
        {/* --- Bagian Reset Password --- */}
        <div className="settings-section">
          <h3>Reset Password</h3>
          <p>Click the button below to receive a password reset link in your email ({user?.email}).</p>
          <button 
            onClick={handlePasswordReset} 
            className="btn btn-secondary"
          >
            Send Reset Email
          </button>
          {resetFeedback && <p className="settings-feedback">{resetFeedback}</p>}
        </div>

        {/* --- Bagian Delete Account --- */}
        <div className="settings-section">
          <h3>Delete Account</h3>
          <p className="danger-zone-text">
            This will permanently delete your authentication account. 
            This action cannot be undone.
          </p>
          <button 
            onClick={handleDeleteAccount} 
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete My Account'}
          </button>
          {deleteFeedback && <p className="settings-feedback error">{deleteFeedback}</p>}
        </div>
        
        <div className="settings-section-warning">
          <strong>Important:</strong> Deleting your account only removes your login credentials. 
          Your movie data in the database will remain (orphaned). For a full data wipe, 
          please contact the administrator. 
          (This requires advanced server-side logic (Cloud Functions) to fix).
        </div>
      </div>
    </div>
  );
};

export default Settings;