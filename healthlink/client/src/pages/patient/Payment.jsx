import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPrescriptionsByPatient, updatePrescriptionStatus } from "../../services/database";
import { FiCreditCard, FiCheckCircle, FiPackage, FiShield, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const RAZORPAY_KEY = "rzp_test_1DP5mmOlF5G5ag";

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

const Payment = () => {
  const { currentUser, userProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [currentUser]);

  const fetchData = async () => {
    try { const p = await getPrescriptionsByPatient(currentUser.uid); setPrescriptions(p); } catch (e) { console.error(e); }
    setLoading(false);
  };

  const calcTotal = (meds) => (!meds || meds.length === 0) ? 100 : meds.length * 150;

  const handlePayment = async (rx) => {
    const loaded = await loadRazorpay();
    if (!loaded) { toast.error("Payment gateway failed to load."); return; }
    const amount = calcTotal(rx.medicines);
    const options = {
      key: RAZORPAY_KEY, amount: amount * 100, currency: "INR", name: "Health Link",
      description: `Prescription - ${(rx.medicines || []).join(", ").substring(0, 50)}`,
      handler: async (res) => {
        try {
          await updatePrescriptionStatus(rx.id, rx.status, { paymentStatus: "paid", paymentId: res.razorpay_payment_id, paidAmount: amount, paidAt: new Date().toISOString() });
          toast.success("Payment successful!"); fetchData();
        } catch (e) { toast.error("Update failed. Contact support."); }
      },
      prefill: { name: userProfile?.name || "", email: userProfile?.email || "", contact: userProfile?.phone || "" },
      theme: { color: "#3b82f6" },
      modal: { ondismiss: () => toast("Payment cancelled", { icon: "\u2139\uFE0F" }) }
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => toast.error("Payment failed. Try again."));
    rzp.open();
  };

  const unpaid = prescriptions.filter(p => p.paymentStatus !== "paid" && p.status !== "rejected");
  const paid = prescriptions.filter(p => p.paymentStatus === "paid");

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-6"><div className="space-y-4"><div className="skeleton h-8 w-48" /><div className="skeleton h-32 w-full" /></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-8">
      <div className="mb-6"><h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payments</h1><p className="text-sm text-gray-500 mt-1">Pay for prescriptions securely via Razorpay</p></div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5"><div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center mb-2"><FiClock className="w-4 h-4 text-amber-500" /></div><p className="text-xl font-bold text-gray-900">{unpaid.length}</p><p className="text-xs text-gray-500">Pending</p></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5"><div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center mb-2"><FiCheckCircle className="w-4 h-4 text-emerald-500" /></div><p className="text-xl font-bold text-gray-900">{paid.length}</p><p className="text-xs text-gray-500">Paid</p></div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 col-span-2 sm:col-span-1"><div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center mb-2"><FiCreditCard className="w-4 h-4 text-blue-500" /></div><p className="text-xl font-bold text-gray-900">{"\u20B9"}{paid.reduce((s, p) => s + (p.paidAmount || calcTotal(p.medicines)), 0)}</p><p className="text-xs text-gray-500">Total Spent</p></div>
      </div>

      {unpaid.length > 0 && (<div className="mb-6"><h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Pending Payments</h2><div className="space-y-3">{unpaid.map((p) => { const t = calcTotal(p.medicines); return (
        <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 card-hover animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2"><FiPackage className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">{p.pharmacyName || "Pharmacy"}{p.doctorName ? ` \u2022 Dr. ${p.doctorName}` : ""}</span></div>
              <div className="flex flex-wrap gap-1.5 mb-2">{(p.medicines || []).map((m, i) => <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-medium">{m}</span>)}</div>
              <div className="flex items-center gap-3"><span className="text-lg font-bold text-gray-900">{"\u20B9"}{t}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.status === "ready" ? "bg-blue-100 text-blue-700" : p.status === "validated" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{p.status === "ready" ? "Ready" : p.status === "validated" ? "Validated" : "Pending"}</span></div>
            </div>
            <button onClick={() => handlePayment(p)} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0"><FiCreditCard className="w-4 h-4" /> Pay {"\u20B9"}{t}</button>
          </div>
        </div>
      ); })}</div></div>)}

      <div><h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Payment History</h2>
      {paid.length === 0 ? (<div className="bg-white rounded-2xl border border-gray-100 p-10 text-center"><FiCreditCard className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500 text-sm font-medium">No payments yet</p></div>
      ) : (<div className="space-y-3">{paid.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0"><div className="flex flex-wrap gap-1.5 mb-1.5">{(p.medicines || []).map((m, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[11px] font-medium">{m}</span>)}</div>
              <p className="text-xs text-gray-400">{p.pharmacyName || "Pharmacy"} {"\u2022"} {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : ""}</p>
              {p.paymentId && <p className="text-[10px] text-gray-300 mt-0.5">ID: {p.paymentId}</p>}</div>
            <div className="text-right flex-shrink-0"><p className="text-lg font-bold text-gray-900">{"\u20B9"}{p.paidAmount || calcTotal(p.medicines)}</p><span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium"><FiCheckCircle className="w-3 h-3" /> Paid</span></div>
          </div>
        </div>
      ))}</div>)}</div>

      <div className="mt-6 flex items-center gap-2 p-3 bg-gray-50 rounded-xl"><FiShield className="w-4 h-4 text-emerald-500 flex-shrink-0" /><p className="text-[11px] text-gray-500">Payments processed securely via Razorpay. Health Link does not store card details.</p></div>
    </div>
  );
};

export default Payment;
