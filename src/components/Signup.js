import React, { useState } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { Radio } from "antd";
import { createUser } from "../Utils/routes";
import styled from "styled-components";
const App = ({ setLogin }) => {
  const Container = styled("div")`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 2rem;
  `;

  const [loading, setLoading] = useState(false);
  const onFinish = (values) => {
    const response = createUser(values, setLoading);
  };
  return (
    <Container>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Radio.Group>
            <Radio value={"Author"}>Author</Radio>
            <Radio value={"Collaborator"}>Collaborator</Radio>
          </Radio.Group>
        </Form.Item>
        <a onClick={() => setLogin(true)} href="#">
          Login
        </a>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};
export default App;
