import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui";
import { useUser } from "../../utils/hooks";

const SelectUserByRole = ({ role, value, onChange, placeholder = "Sélectionner un utilisateur" }) => {
    const { fetchAllUsers } = useUser();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchAllUsers().then((all) => {
        const filtered = all.filter((u) => u.role === role);
        setUsers(filtered);
        });
    }, [role]);

    const selectedId = typeof value === "object" ? value._id : value;

    const getUserName = (id) => {
        const user = users.find((u) => u._id === id);
        return user ? `${user.firstname} ${user.lastname}` : "";
    };

    return (
        <Select
            value={selectedId}
            onValueChange={(userId) => {
                const selected = users.find((u) => u._id === userId);
                onChange?.(selected || userId);
            }}
        >
        <SelectTrigger>
            <SelectValue>
                {getUserName(selectedId) || placeholder}
            </SelectValue>
        </SelectTrigger>
        <SelectContent>
            {users.map((u) => (
                <SelectItem key={u._id} value={u._id}>
                    {u.firstname} {u.lastname}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
    );
};

SelectUserByRole.propTypes = {
  role: PropTypes.oneOf(["admin", "manager", "professor", "student"]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default SelectUserByRole;
