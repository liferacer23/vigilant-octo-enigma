import React, { useState } from "react";
import styled from "styled-components";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseSquareOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";

const BookComponentContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const BookCover = styled("div")`
  width: 100px;
  height: 150px;
  background-color: #f4f4f4;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const Button = styled("button")`
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  margin-left: 5px;
`;

const Input = styled("input")`
  margin-right: 5px;
`;
export default function BookComponent({
  index,
  data,
  depth = 0,
  onAddSection,
  onEditSection,
  onDeleteSection,
  userData,
}) {
  const indent = `${depth * 20}px`; // Adjust indentation based on depth

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(data.title);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(data.title);
  };

  const handleSaveEdit = () => {
    onEditSection(data.id, newTitle);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    onDeleteSection(data.id);
  };

  const handleAddClick = () => {
    onAddSection(data.id, null, newSectionTitle);
    setNewSectionTitle("");
    setNewSectionContent("");
  };

  return (
    <BookComponentContainer style={{ marginLeft: indent }}>
      <div>
        <strong>Title:</strong>{" "}
        {isEditing ? (
          <>
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button onClick={handleSaveEdit}>
              <SaveOutlined />
            </Button>
            <Button onClick={handleCancelEdit}>
              <CloseSquareOutlined />
            </Button>
          </>
        ) : (
          <>
            {data.title}
            <Button onClick={handleEditClick}>
              <EditOutlined />
            </Button>
            <Button onClick={handleDeleteClick}>
              <DeleteOutlined />
            </Button>
            <Button onClick={handleAddClick}>
              <AppstoreAddOutlined />
            </Button>
          </>
        )}
        {!isEditing && (
          <>
            {userData?.role === "Author" && (
              <>
                <Input
                  type="text"
                  placeholder="New Section Title"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
                <Button onClick={handleAddClick}>
                  <AppstoreAddOutlined />
                </Button>
              </>
            )}
          </>
        )}
      </div>
      {data.sections && data.sections.length > 0 && (
        <div>
          <strong>Sections:</strong>
          {data.sections.map((section, index) => (
            <BookComponent
              key={section.id}
              data={section}
              depth={depth + 1}
              onAddSection={onAddSection}
              onEditSection={onEditSection}
              onDeleteSection={onDeleteSection}
              index={index}
            />
          ))}
        </div>
      )}
    </BookComponentContainer>
  );
}
