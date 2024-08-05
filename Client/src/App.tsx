import "./App.css";
import * as UserApi from "./services/users";
import { Route, Routes, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HomeLayout from "./pages/HomeLayout";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import { GridItem, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLoggedInUser } from "./hooks/useLoggInUser";
import Navbar from "./components/Navbar";

function App() {
  const { setCurrentUser } = useLoggedInUser();
  const toast = useToast();
  const navigate = useNavigate();
  const handleSignup = () => {
    getLoggedInUser();
    navigate("/dashboard");
  };

  const getLoggedInUser = async () => {
    try {
      const user = await UserApi.getLoggedInUser();
      if (user) {
        setCurrentUser(user);
        navigate("/dashboard");
      }
    } catch (er) {
      toast({
        position: "top-right",
        title: "User not logged in",
        description: `${er}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    getLoggedInUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GridItem area="nav" zIndex="1">
        <Navbar />
      </GridItem>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomeLayout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* rest of the protected routes */}
        </Route>
        <Route path="/api">
          <Route
            path="signup"
            element={<Signup onSuccessfulSignup={handleSignup} />}
          />
          <Route
            path="login"
            element={<Login onSuccessfulLogin={handleSignup} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
