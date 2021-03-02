import React from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";

function Form({ type, handleSubmit }) {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const emailRef = useRef("");
  const userNameRef = useRef("");
  const passwordRef = useRef("");

  const submitForm = (e) => {
    e.preventDefault();
    let user = {
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      userName: userNameRef.current.value,
      password: passwordRef.current.value,
    };
    handleSubmit(user);
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    userNameRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <form className="my-3 text-dark p-3 my-0 rounded" onSubmit={submitForm}>
      {type === "signup" && (
        <>
          <div className="form-group my-2">
            <label>First Name:</label>
            <input
              type="text"
              ref={firstNameRef}
              placeholder="First Name"
              className="form-control"
              required
            />
          </div>
          <div className="form-group my-2">
            <label>Last Name:</label>
            <input
              type="text"
              ref={lastNameRef}
              placeholder="Last Name"
              className="form-control"
              required
            />
          </div>
          <div className="form-group my-2">
            <label>Email:</label>
            <input
              type="email"
              ref={emailRef}
              placeholder="Email"
              className="form-control"
              required
            />
          </div>
        </>
      )}
      <div className="form-group my-2">
        <label>User Name:</label>
        <input
          type="text"
          ref={userNameRef}
          placeholder="User Name"
          className="form-control"
          required
        />
      </div>
      <div className="form-group my-2">
        <label>Password:</label>
        <input
          type="password"
          ref={passwordRef}
          placeholder="Password"
          className="form-control"
          required
        />
      </div>
      <div className="form-group my-2">
        <button type="submit" className="float-right btn btn-sm btn-danger">
          SignUp
        </button>
        <Link to="/" className="btn btn-sm btn-secondary float-left">
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default Form;
