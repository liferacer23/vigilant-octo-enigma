import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { editUser } from "../Utils/routes";

const ProfileSettingsModal = ({
  setEditUserModalVisible,
  editUserModalVisible,
  setUserData,
  userData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { email, password, username } = values;
      const response = await editUser({
        email: email || userData.email,
        password: password || userData.password,
        username: username || userData.username,
        id: userData.id,
      });
      setUserData(response);
      setLoading(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit"
      visible={editUserModalVisible}
      onCancel={() => setEditUserModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setEditUserModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: false, message: "Please enter your new username" },
          ]}
        >
          <Input placeholder={userData?.username} />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: false, message: "Please enter your new password" },
          ]}
        >
          <Input.Password placeholder="New Password" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: false, message: "Please enter your new email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input placeholder={userData?.email} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileSettingsModal;
