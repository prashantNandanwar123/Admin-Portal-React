export default function Payouts() {
  const payouts = [
    {
      id: "PAY001",
      beneficiary: "Rahul Sharma",
      amount: "₹25,000",
      method: "Bank Transfer",
      status: "completed",
      date: "5 May 2026",
    },
    {
      id: "PAY002",
      beneficiary: "Amit Kumar",
      amount: "₹10,500",
      method: "UPI",
      status: "pending",
      date: "4 May 2026",
    },
    {
      id: "PAY003",
      beneficiary: "Neha Gupta",
      amount: "₹7,200",
      method: "IMPS",
      status: "failed",
      date: "3 May 2026",
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Payouts</h1>

      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-2">Payout ID</th>
              <th className="text-left">Beneficiary</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payouts.map((p, i) => (
              <tr key={i} className="border-b">
                <td className="py-3">{p.id}</td>
                <td>{p.beneficiary}</td>
                <td className="font-medium">{p.amount}</td>
                <td>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {p.method}
                  </span>
                </td>
                <td>
                  <StatusBadge status={p.status} />
                </td>
                <td>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🔹 Status Badge */
function StatusBadge({ status }) {
  const styles = {
    completed: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    failed: "bg-red-100 text-red-500",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}