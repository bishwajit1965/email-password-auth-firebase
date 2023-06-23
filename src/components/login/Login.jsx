import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { Link } from "react-router-dom";

const Login = () => {
  const auth = getAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const emailRef = useRef();
  
  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    console.log(email, password);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setError("");
        event.target.reset();
        if (!user.emailVerified) {
          alert("Your email is not verified. Verify it first.");
        }
        setSuccess("User login successful!");
        // sendVerificationEmail(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.errorCode;
        console.error(errorCode);
        setError(errorMessage);
      });

    //Clear message
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

    // Email verification
    // const sendVerificationEmail = (user) => {
    //   sendEmailVerification(user)
    //     .then((result) => {
    //       console.log(result);
    //       alert("Please verify your email address.");
    //     })
    //     .catch((error) => {
    //       console.log(error.message);
    //     });
    // };
  };

  const handleResetPassword = () => {
    const email = emailRef.current.value;
    if (!email) {
      alert("Please provide your email address. ");
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Please check your email");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <Form
        onSubmit={handleLogin}
        className="w-25 border p-5 rounded shadow-lg"
      >
        <h2 className="text-primary">Please Login</h2>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            ref={emailRef}
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
        <p className="mt-2">
          <small>
            Forgot password ?{" "}
            <Link onClick={handleResetPassword}>Reset Password</Link>{" "}
          </small>
        </p>
        <p>
          <small>
            New to this website? Please <Link to="/register">Register</Link>
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

export default Login;
