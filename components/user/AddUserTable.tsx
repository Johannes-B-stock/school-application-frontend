import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import GoogleSpinner from "../common/GoogleSpinner";
import { throttle } from "throttle-debounce";
import { findUsersWithName } from "lib/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import Link from "next/link";
import { User } from "api-definitions/backend";
import { defaultAvatarPath } from "@/config/index";
import AuthContext from "@/context/AuthContext";

export default function AddUserTable({
  load,
  excludedUsers,
  addedUsers,
}: {
  load: boolean;
  excludedUsers: User[];
  addedUsers: Dispatch<SetStateAction<User[]>>;
}) {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [usersToAdd, setUsersToAdd] = useState<User[]>([]);

  const throttleUserSearch = throttle(
    500,
    (search) => {
      setUserSearch(search);
    },
    { noLeading: true, noTrailing: false }
  );

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      if (load) {
        try {
          setUsersLoading(true);

          const users = await findUsersWithName(
            [userSearch],
            token,
            ["picture", "role"],
            {
              id: {
                $notIn: excludedUsers?.map((usr) => usr.id) ?? [],
              },
            }
          );
          setUsers(users);
        } catch (error) {
          console.log(error);
        } finally {
          setUsersLoading(false);
        }
      } else {
        setUsersToAdd([]);
        addedUsers([]);
      }
    }
    fetchData();
  }, [load, userSearch, token, excludedUsers, addedUsers]);

  const onChangeUserSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    throttleUserSearch(value);
  };

  const addUser = (user: User) => {
    if (usersToAdd.includes(user)) {
      return;
    }
    const newUserlist = [...usersToAdd, user];
    setUsersToAdd(newUserlist);
    addedUsers(newUserlist);
  };

  const removeUser = (user: User) => {
    const updatedUsers = [...usersToAdd];
    _.remove(updatedUsers, (u) => u.id === user.id);
    setUsersToAdd(updatedUsers);
    addedUsers(updatedUsers);
  };

  return (
    <>
      <p className="control has-icons-left mb-5">
        <input
          className="input"
          type="text"
          onChange={onChangeUserSearch}
          placeholder="Search"
        />
        <span className="icon is-left">
          <FontAwesomeIcon icon={faSearch} />
        </span>
      </p>
      <table className="table is-fullwidth">
        <tbody>
          {usersLoading && <GoogleSpinner />}
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="">
                    <div className="image is-32x32 is-rounded">
                      <Image
                        alt={user.username}
                        src={
                          user.picture?.formats.thumbnail.url ??
                          user.picture?.url ??
                          defaultAvatarPath
                        }
                        className="image is-32x32 is-rounded"
                        objectFit="cover"
                        width="32"
                        height="32"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <Link href={`/user/${user.id}`}>{user.username}</Link>
                </td>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td className="is-italic">{user.role?.name}</td>
                <td>
                  <div
                    className="button is-small is-success"
                    onClick={() => addUser(user)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <hr />
      <h4 className="title is-4">Additional Staff</h4>
      <table className="table is-fullwidth">
        <tbody>
          {usersToAdd.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="">
                  <div className="image is-32x32 is-rounded">
                    <Image
                      alt={user.username}
                      src={
                        user.picture?.formats?.thumbnail?.url ??
                        user.picture?.url ??
                        defaultAvatarPath
                      }
                      className="image is-32x32 is-rounded"
                      objectFit="cover"
                      width="32"
                      height="32"
                    />
                  </div>
                </div>
              </td>
              <td>{user.username}</td>
              <td>
                {user.firstname} {user.lastname}
              </td>
              <td>
                <div
                  className="button is-small is-danger"
                  onClick={() => removeUser(user)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
