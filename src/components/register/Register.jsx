import React, { useState } from "react";
import app from "../../firebase/firebase.config";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const Register = () => {
  const auth = getAuth(app);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    console.log(name, email, password);
    setSuccess("");
    setError("");

    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Please add at least one uppercase letter.");
      return;
    } else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError("Please add at least two numbers.");
    } else if (password.length < 6) {
      setError("Please add at least 6 characters.");
    }
    // sign up user
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        const loggedInUser = result.user;
        console.log(loggedInUser);
        setError("");
        event.target.reset();
        setSuccess("User has been created successfully!");
        updateUserData(result.user, name);
        sendVerificationEmail(result.user);
      })
      .catch((error) => {
        console.error(error.message);
        setError(error.message);
      });
    const sendVerificationEmail = (user) => {
      sendEmailVerification(user)
        .then((result) => {
          console.log(result);
          alert("Please verify your email address.");
        })
        .catch((error) => {
          console.log(error.message);
        });
    };
    const updateUserData = (name) => {
      updateProfile(user, { displayName: name })
        .then(() => {
          alert("User updated!");
        })
        .catch((error) => {
          setError(error.message);
        });
    };
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Form
        onSubmit={handleSubmit}
        className="w-25 p-5 border rounded shadow-lg"
      >
        <h2 className="text-primary">Register</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter name"
            required
            className="form-control-sm"
          />
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            required
            className="form-control-sm"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            required
            className="form-control-sm"
          />
        </Form.Group>
        <p>
          <small>
            Member already ? Please <Link to="/login">Login</Link>
          </small>
        </p>
        <div className="">
          {error && <p className="text-danger"> {error}</p>}
          {success && <p className="text-success"> {success}</p>}
        </div>

        <Button variant="primary mt-2" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default Register;
