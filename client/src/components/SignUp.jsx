import React from "react";
import { useHistory } from "react-router";
import Form from "./Form";

function SignUp() {
  const history = useHistory();
  const signupUser = (user) => {
    console.log(user);

    fetch("/sign-up", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(data.error);
        } else if (data.message) {
          alert(data.message);
          history.goBack();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5 card mx-2 my-5 p-0 mx-md-auto">
          <div className="card-header">
            <h4 className="text-danger text-center">Sign Up</h4>
          </div>
          <div className="card-content p-0">
            <Form type="signup" handleSubmit={signupUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
