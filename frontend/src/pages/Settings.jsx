import DashboardLayout from "../layouts/DashboardLayout";

function Settings() {
  return (
    <DashboardLayout title="Settings" subtitle="Configure profile, security, and clinic preferences.">
      <section className="settings-grid">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <h2>Profile</h2>
          </div>
          <form className="settings-form">
            <label>
              Full name
              <input type="text" defaultValue="Dr. Sarah Johnson" />
            </label>
            <label>
              Email
              <input type="email" defaultValue="sarah@medsync.com" />
            </label>
            <label>
              Department
              <input type="text" defaultValue="General Medicine" />
            </label>
            <button type="button">Save Changes</button>
          </form>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <h2>Preferences</h2>
          </div>
          <div className="preference-list">
            <label><input type="checkbox" defaultChecked /> Appointment reminders</label>
            <label><input type="checkbox" defaultChecked /> Lab report notifications</label>
            <label><input type="checkbox" /> Weekly analytics email</label>
            <label><input type="checkbox" defaultChecked /> Patient follow-up alerts</label>
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}

export default Settings;
