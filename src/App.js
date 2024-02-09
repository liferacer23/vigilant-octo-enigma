import { useState, useEffect } from "react";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import { fetchAllBooks, fetchUserData, updateBooks } from "./Utils/routes";
import { jwtDecode } from "jwt-decode";
import BooksComponent from "./components/BooksComponent";
import { Button, Drawer } from "antd";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { UserOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import EditUserModal from "./components/EditUserModal";
import styled from "styled-components";

const AvatarContainer = styled("div")`
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Add background color for frosted glass effect */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08); /* Add shadow for depth */

  & > svg {
    font-size: 24px;
    color: #555;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #333;
    }
  }

  & > span {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-top: 8px;
  }
`;

const BookContainer = styled("div")`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Add transparency for frosted glass effect */
  border-radius: 10px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const PageContainer = styled("div")`
  background: linear-gradient(
    135deg,
    #ff7979,
    #ffd88e
  ); /* Add linear gradient background */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
function App() {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  const [books, setBooks] = useState([]);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const storedToken = localStorage.getItem("accessToken");
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);

      setCurrentUserId(decodedToken.sub);
    }
  }, [storedToken]);

  useEffect(() => {
    if (currentUserId) {
      setLoading(true);
      fetchUserData(currentUserId, storedToken).then((response) => {
        setUserData(response);
        setLoading(false);
      });
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchAllBooks().then((response) => {
      setBooks(response);
    });
  }, [userData]);

  const handleAddSection = (sectionId, parentId, title) => {
    const findAndAddSection = (sections, id) => {
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].id === id) {
          sections[i].sections.push({
            id: uuidv4(),
            title,
            sections: [],
          });
          return true;
        } else if (
          sections[i].sections &&
          findAndAddSection(sections[i].sections, id)
        ) {
          return true;
        }
      }
      return false;
    };

    const findAndAddSectionInBooks = (books) => {
      for (const book of books) {
        if (findAndAddSection(book.sections, sectionId)) {
          return true;
        }
        if (book.sections && findAndAddSectionInBooks(book.sections)) {
          return true;
        }
      }
      return false;
    };

    if (parentId === null) {
      if (findAndAddSection(books, sectionId)) {
        updateBooks(books, books.id, storedToken);
      } else {
        console.error(`Section with id ${sectionId} not found.`);
      }
    } else {
      findAndAddSectionInBooks(books);
    }
  };

  const handleEditSection = (sectionId, newTitle) => {
    let updatedBookId = null;
    const updatedBooks = books.map((book) => {
      const updateSection = (sections) => {
        return sections.map((section) => {
          if (section.id === sectionId) {
            updatedBookId = book.id;
            return { ...section, title: newTitle };
          } else if (section.sections) {
            return { ...section, sections: updateSection(section.sections) };
          }
          return section;
        });
      };
      return { ...book, sections: updateSection(book.sections) };
    });
    setBooks(updatedBooks);
    if (updatedBookId) {
      updateBooks(updatedBooks, updatedBookId);
    }
  };

  const handleDeleteSection = (sectionId) => {
    let updatedBookId = null;
    const updatedBooks = books.map((book) => {
      const deleteSection = (sections) => {
        return sections.filter((section) => {
          if (section.id === sectionId) {
            updatedBookId = book.id;
            return false;
          } else if (section.sections) {
            section.sections = deleteSection(section.sections);
          }
          return true;
        });
      };
      return { ...book, sections: deleteSection(book.sections) };
    });
    setBooks(updatedBooks);
    if (updatedBookId) {
      updateBooks(updatedBooks, updatedBookId);
    }
  };

  console.log(editUserModalVisible, "editUserModalVisible", userData);

  return (
    <PageContainer>
      <div>
        <AvatarContainer>
          <UserOutlined />
          Hello {userData?.username}{" "}
          <Button
            onClick={() => {
              setEditUserModalVisible(true);
            }}
          >
            <EditOutlined />
          </Button>
        </AvatarContainer>
      </div>

      {!userData && !loading ? (
        login && !loading ? (
          <SignUp setLogin={setLogin} setUserData={setUserData} />
        ) : (
          <Login setUserData={setUserData} setLogin={setLogin} />
        )
      ) : loading ? (
        <div>Loading</div>
      ) : (
        <div>
          {" "}
          <BookContainer>
            {books.map((book, index) => {
              return (
                <>
                  <BooksComponent
                    userData={userData}
                    data={book}
                    onAddSection={handleAddSection}
                    onEditSection={handleEditSection}
                    onDeleteSection={handleDeleteSection}
                    parentId={null}
                  />
                </>
              );
            })}
          </BookContainer>
        </div>
      )}
      <EditUserModal
        setEditUserModalVisible={setEditUserModalVisible}
        editUserModalVisible={editUserModalVisible}
        userData={userData}
        setUserData={setUserData}
      />
    </PageContainer>
  );
}

export default App;
