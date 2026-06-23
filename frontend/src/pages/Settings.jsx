import DashboardLayout from "../layouts/DashboardLayout";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
              <input type="text" defaultValue={user.name || "User Name"} />
            </label>
            <label>
              Email
              <input type="email" defaultValue={user.email || "user@medsync.com"} />
            </label>
            <label>
              Role
              <input type="text" defaultValue={user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : "Staff"} disabled />
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
