import React, { useState } from "react";
import ReservationPage from "./ReservationPage";
import PaymentPage from "./PaymentPage";
import "./App.css";

function App() {
  const [page, setPage] = useState("reservation");
  const [studentData, setStudentData] = useState(null);

  return (
    <div>
      {page === "reservation" && (
        <ReservationPage
          onProceed={(data) => {
            setStudentData(data);
            setPage("payment");
          }}
        />
      )}
      {page === "payment" && (
        <PaymentPage studentData={studentData} onBack={() => setPage("reservation")} />
      )}
    </div>
  );
}

export default App;
