export default function Merchants() {
  const merchants = [
    { name: "Swiggy India Pvt Ltd", email: "swiggy@mail.com", status: "Active" },
    { name: "Zepto Technologies", email: "zepto@mail.com", status: "Active" },
    { name: "NoBroker", email: "nobroker@mail.com", status: "Inactive" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Merchants</h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Name</th>
              <th className="text-left">Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {merchants.map((m, i) => (
              <tr key={i} className="border-b">
                <td className="py-3">{m.name}</td>
                <td>{m.email}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      m.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}