import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Table, Image, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [render, setRender] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [profile, setProfile] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const getAllData = await axios.get("https://file-upload-app-server-mern.onrender.com/api/v1/users");
        setUsers(getAllData.data);
      } catch (error) {
        setError("Failed to fetch users");
        toast.error("Failed to fetch users");
      }
    };
    getAllUsers();
  }, [render]);

  const formdata = new FormData();
  formdata.append("name", inputs.name);
  formdata.append("email", inputs.email);
  formdata.append("age", inputs.age);
  formdata.append("profile", profile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://file-upload-app-server-mern.onrender.com/api/v1/users", formdata);
      setRender(!render);
      setInputs({
        name: "",
        email: "",
        age: "",
      });
      toast.success("User added successfully");
    } catch (error) {
      setError("Failed to add user");
      toast.error("Failed to add user");
    }
  };

  return (
    <Container className="my-5">
      <ToastContainer />
      <Row>
        <Col className="text-center mb-4">
          <h1 className="text-white bg-primary p-3 rounded">File Upload App</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={inputs.name}
                onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                name="name"
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                name="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                value={inputs.age}
                onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                name="age"
                placeholder="Enter age"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProfile(e.target.files[0])}
                name="profile"
              />
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Col>
        <Col md={6}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {users && users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td>
                    <Image
                      src={`https://file-upload-app-server-mern.onrender.com/uploads/${user.profile}`}
                      alt="user profile"
                      fluid
                      rounded
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
