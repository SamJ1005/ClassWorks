import React, { useState } from "react";
import "./App.css";

function ReservationPage({ onProceed }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    gender: "",
    courses: [],
  });

  const [errors, setErrors] = useState({});

  // --- validation ---
  const validateField = (name, value) => {
    let err = "";

    if (name === "name") {
      if (!value.trim()) err = "Name cannot be empty.";
      else if (value.length < 3) err = "Name must be at least 3 characters.";
    }

    if (name === "email") {
      const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!pattern.test(value.trim())) err = "Please enter a valid email.";
    }

    if (name === "address") {
      if (!value.trim()) err = "Address cannot be empty.";
    }

    if (name === "mobile") {
      if (!/^\d{10}$/.test(value)) err = "Phone must be exactly 10 digits.";
    }

    return err;
  };

  // --- input handling ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;

    if (name === "name") v = v.replace(/\d/g, "");
    if (name === "mobile") v = v.replace(/\D/g, "");

    setForm((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, v) }));
  };

const handleCourseChange = (course, schedule) => {
  let updated = [...form.courses];

  if (updated.length >= 2) {
    alert("⚠ You can choose a maximum of 2 courses.");
    return;
  }

  if (updated.some((c) => c.course === course)) {
    alert("⚠ You already selected this course. Choose another course.");
    return;
  }

  if (updated.some((c) => c.schedule === schedule)) {
    alert("⚠ You already selected a course in this time slot. Choose a different timing.");
    return;
  }

  updated.push({ course, schedule });
  setForm((prev) => ({ ...prev, courses: updated }));

  // ✅ Clear course error once a course is selected
  setErrors((prev) => ({ ...prev, courses: "" }));
};

  const removeCourse = (index) => {
    const updated = form.courses.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, courses: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(form).forEach((field) => {
      if (field !== "courses") {
        const err = validateField(field, form[field]);
        if (err) newErrors[field] = err;
      }
    });
    if (form.courses.length === 0) {
      newErrors.courses = "Select at least one course.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onProceed(form);
    }
  };

  return (
    <div className="form-container">
      <div className="header">
        <img src="/Computer.png" alt="Logo" />
        <div className="header-text">
          <h2>Computer Online Class Reservation Form</h2>
          <h5>"The great aim of education is not knowledge, but action"</h5>
        </div>
      </div>
      <hr />

      <form onSubmit={handleSubmit}>
        {/* --- Inputs --- */}
        <label>Full Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
        <span className="error">{errors.name}</span>

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <span className="error">{errors.email}</span>

        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <span className="error">{errors.address}</span>

        <label>Phone Number:</label>
        <input
          type="tel"
          name="mobile"
          maxLength="10"
          value={form.mobile}
          onChange={handleChange}
        />
        <span className="error">{errors.mobile}</span>

        <label>Gender:</label>
        <div className="gender-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={form.gender === "Male"}
              onChange={handleChange}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={form.gender === "Female"}
              onChange={handleChange}
            />{" "}
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={form.gender === "Other"}
              onChange={handleChange}
            />{" "}
            Other
          </label>
        </div>
        <span className="error">{errors.gender}</span>

        <label style={{color:"blue"}}>Can choose up to 2 Courses at different time (different courses):</label>
        <div className="course-buttons">
  {["Full Stack Development", "Python Programming", "Graphic Design", "Data Science"].map(
    (course) => (
      <div key={course} style={{ marginBottom: "8px" }}>
        <strong style={{ fontSize: "1.3em" }}>{course}</strong> {/* only course name bigger */}
        <div>
          <button type="button" onClick={() => handleCourseChange(course, "Morning")}>
            Morning (10AM - 12PM)
          </button>
          <button type="button" onClick={() => handleCourseChange(course, "Afternoon")}>
            Afternoon (1PM - 3PM)
          </button>
          <button type="button" onClick={() => handleCourseChange(course, "Evening")}>
            Evening (6PM - 8PM)
          </button>
        </div>
      </div>
    )
  )}
</div>
        <span className="error">{errors.courses}</span>

        <ul>
          {form.courses.map((c, i) => (
            <li key={i} style={{fontSize:"1.4em"}}>
              {c.course} ({c.schedule}){" "}
              <button style={{fontSize:"1.2em"}} type="button" onClick={() => removeCourse(i) }>❌</button>
            </li>
          ))}
        </ul>

        <div className="button-group">
          <input
            type="reset"
            value="Reset"
            onClick={() =>
              setForm({
                name: "",
                email: "",
                address: "",
                mobile: "",
                gender: "",
                courses: [],
              })
            }
          />
          <input type="submit" value="Reserve Now" />
        </div>
      </form>
    </div>
  );
}

export default ReservationPage;
