import React, { useContext, useEffect, useState } from "react";

interface UserContextInterface {
  id: number | undefined;
  email: string | undefined;
  username: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  setUser: (
    id: number,
    newEmail: string,
    username: string,
    firstname: string | undefined,
    lastname: string | undefined
  ) => void;
  clearUser: () => void;
}

const UserContext = React.createContext<UserContextInterface>({
  id: undefined,
  email: undefined,
  username: undefined,
  firstname: undefined,
  lastname: undefined,
  setUser: () => {},
  clearUser: () => {},
});
interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [id, setId] = useState<number | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [firstname, setFirstname] = useState<string | undefined>(undefined);
  const [lastname, setLastname] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const setUser = (
    id: number,
    newEmail: string,
    username: string,
    firstname: string | undefined,
    lastname: string | undefined
  ) => {
    setId(id);
    setEmail(newEmail); 
    setUsername(username);
    setFirstname(firstname);
    setLastname(lastname);
  };

  const clearUser = () => {
    setEmail(undefined);
    setUsername(undefined);
  };

  const fetchUser = async (signal: AbortSignal) => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/current/", { signal });
      const responseData = await response.json();
      if (response.ok && responseData?.id && responseData?.email) {
        setUser(
          responseData.id,
          responseData.email,
          responseData.username,
          responseData.first_name || undefined,
          responseData.last_name || undefined
        );
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (reason) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser(new AbortController().signal);
  }, []);

  return (
    <UserContext.Provider
      value={{
        id,
        email,
        username,
        firstname,
        lastname,
        clearUser,
        setUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
