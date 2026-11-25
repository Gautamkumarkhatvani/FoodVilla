import UserForm from "../components/users/UserForm";
import UserList from "../components/users/UserList";
import "../styles/index.css";

const Users = () => {
  return (
    <div className="ad-content">
      <UserForm />
      <UserList />
    </div>
  );
};

export default Users;
