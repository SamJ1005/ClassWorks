import React, { useState } from "react";
import "./App.css";

function PaymentPage({ studentData, onBack }) {
  const courseFees = {
    "Full Stack Development": 5000,
    "Python Programming": 4000,
    "Graphic Design": 3000,
    "Data Science": 6000,
  };

  const [referral, setReferral] = useState("");
  const [referralError, setReferralError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paid, setPaid] = useState(false);
  const [showBill, setShowBill] = useState(false);

  const baseTotal = studentData.courses.reduce(
    (sum, c) => sum + (courseFees[c.course] || 0),
    0
  );

  const handleReferralChange = (e) => {
    const value = e.target.value.toUpperCase();
    setReferral(value);

    if (value && !/^[A-Z0-9]{8}$/.test(value)) {
      setReferralError("Referral code must be exactly 8 characters (letters/numbers).");
    } else {
      setReferralError("");
    }
  };

  const referralDiscount =
    referral && !referralError ? baseTotal * 0.1 : 0;

  // Payment method discount
  let methodDiscount = 0;
  if (paymentMethod === "UPI") methodDiscount = baseTotal * 0.03;
  if (paymentMethod === "NetBanking") methodDiscount = baseTotal * 0.05;

  const finalTotal = baseTotal - referralDiscount - methodDiscount;

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("⚠ Please select a payment method before proceeding.");
      return;
    }
    if (referral && referralError) {
      alert("⚠ Please fix referral code before payment.");
      return;
    }
    setPaid(true);
  };

  return (
    <div className="form-container">
      <h2 style={{fontWeight:"bolder", fontSize:"3em"}}>Course Payment</h2>

      <p style={{fontSize:"1.3em"}}>
        <strong>👤 Student Name:</strong> {studentData.name}
      </p>

      <h3 style={{ fontSize: "1.3em"}}>📚 Selected Courses :</h3>
      <ul style={{ fontSize: "1.3em", fontWeight: "normal" }}>
        {studentData.courses.map((c, idx) => (
          <li key={idx}>
            {c.course} ({c.schedule}) = ₹{courseFees[c.course]}
          </li>
        ))}
      </ul>

      <p>
        <strong style={{ fontSize:"1.3em" }}>Total:</strong>{" "}
        <span style={{ fontWeight: "bold", fontSize:"1.3em" }}>₹{baseTotal}</span>
      </p>

      <label>
        Referral Code (optional,10% off):
        <textarea
          rows="1"
          maxLength="8"
          value={referral}
          onChange={handleReferralChange}
          placeholder="Enter referral code"
          style={{
            width: "100%",
            marginTop: "5px",
            fontSize: "1em",
            padding: "8px",
          }}
        />
      </label>
      {referralError && <p className="error">{referralError}</p>}

      {referralDiscount > 0 && (
        <p style={{ color: "green", fontWeight: "normal" }}>
          ✅ Referral Discount Applied: -₹{referralDiscount.toFixed(2)}
        </p>
      )}

      <label>
        Payment Method <span style={{ color: "red" }}>*</span>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ display: "block", marginTop: "8px", padding: "5px", fontSize:"0.9em" }}
          required
        >
          <option value="">-- Select a method --</option>
          <option value="CreditCard">Credit Card</option>
          <option value="UPI">UPI (3% discount)</option>
          <option value="NetBanking">Net Banking (5% discount)</option>
          <option value="Cash">Cash</option>
        </select>
      </label>

      {methodDiscount > 0 && (
        <p style={{ color: "blue", fontWeight: "normal" }}>
           Payment Method Discount: -₹{methodDiscount.toFixed(2)}
        </p>
      )}

      <h3 style={{ marginTop: "20px", fontSize:"1.3em" }}>
        Final Payable Amount:{" "}
        <span style={{ color: "black", fontWeight: "bolder", fontSize:"1.2em" }}>
          ₹{finalTotal.toFixed(2)}
        </span>
      </h3>

      <div className="button-group">
        <button onClick={onBack} style={{fontSize:"1em", width:"150px"}}>⬅ Back</button>
        <button
          style={{ backgroundColor: "green", color: "white", fontSize:"1em",width:"150px" }}
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>

      {paid && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ color: "green", fontWeight: "bold",fontSize:"1.7em" }}>
            🎉 Payment Successful! Thank you.
          </p>
          <button
            style={{ backgroundColor: "#007bff", color: "white", marginTop: "10px" }}
            onClick={() => setShowBill(true)}
          >
            Show Bill
          </button>
        </div>
      )}

      {showBill && (
  <div
    style={{
      marginTop: "30px",
      border: "1px solid #ccc",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
      <img src="/Computer.png" alt="Logo" style={{ maxWidth: "80px", borderRadius: "20%" }} />
      <div style={{ flex: 1, textAlign: "center" }}>
        <h2 style={{ margin: 0, fontSize:"3em" }}>Computer Online Education Centre</h2>
        <h5 style={{ margin: 0, fontWeight: "normal", fontStyle: "italic", fontSize:"1.1em" }}>
          "The great aim of education is not knowledge, but action"
        </h5>
      </div>
    </div>
    <hr />

    <h3 style={{ marginTop: "10px", fontSize:"1.5em" }}> Payment Receipt</h3>
    <p style={{ fontSize:"1.2em"}}><strong>Student:</strong> {studentData.name}</p>
    <p style={{ fontSize:"1.2em"}}><strong>Payment Method:</strong> {paymentMethod}</p>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        fontSize:"1.2em",
      }}
    >
      <thead>
        <tr>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Course</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Schedule</th>
          <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Fee (₹)</th>
        </tr>
      </thead>
      <tbody>
        {studentData.courses.map((c, idx) => (
          <tr key={idx}>
            <td>{c.course}</td>
            <td>{c.schedule}</td>
            <td>{courseFees[c.course]}</td>
          </tr>
        ))}
        <tr>
          <td colSpan="2"><strong>Total</strong></td>
          <td>₹{baseTotal}</td>
        </tr>
        {referralDiscount > 0 && (
          <tr>
            <td colSpan="2">Referral Discount</td>
            <td>-₹{referralDiscount.toFixed(2)}</td>
          </tr>
        )}
        {methodDiscount > 0 && (
          <tr>
            <td colSpan="2">Payment Method Discount</td>
            <td>-₹{methodDiscount.toFixed(2)}</td>
          </tr>
        )}
        <tr>
            <td colSpan="3">
                <hr style={{ border: "1px solid #000", margin: "8px 0" }} />
            </td>
        </tr>
        <tr style={{ fontSize:"1.2em"}}>
          <td colSpan="2"><strong>FINAL TOTAL</strong></td>
          <td><strong>₹{finalTotal.toFixed(2)}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}

export default PaymentPage;
