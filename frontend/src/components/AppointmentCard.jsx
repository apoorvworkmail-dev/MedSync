function AppointmentCard({ appointment, onCancel }) {

  const statusColors = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="appointment-card bg-white rounded-2xl shadow-lg p-5 border-l-4 border-blue-500">

      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-gray-800">{appointment.patient}</h2>

        <div className="flex flex-col items-end">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[appointment.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {appointment.status}
          </span>

          <button
            onClick={() => onCancel?.(appointment.id)}
            className="mt-2 text-sm text-red-600 hover:underline"
            type="button"
          >
            Cancel
          </button>
        </div>

      </div>

      <div className="mt-4 space-y-2 text-gray-600">

        <p>
          <span className="font-semibold">Doctor:</span>
          {" "} {appointment.doctor}
        </p>

        <p>
          <span className="font-semibold">Date:</span>
          {" "} {appointment.date || "Date not set"}
        </p>

        <p>
          <span className="font-semibold">Time:</span>
          {" "} {appointment.time || "Time not set"}
        </p>

        {/* Cancel moved to header for visibility */}

      </div>

    </div>
  );
}

export default AppointmentCard;