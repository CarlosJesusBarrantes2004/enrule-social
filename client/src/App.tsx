import { Route, Routes, useLocation } from "react-router-dom";
import { Home, Profile, Login, Register, ResetPassword } from "./pages";
import Layout from "./Layout";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect } from "react";
import { resetMessage } from "./store/messageSlice";

function App() {
  const location = useLocation();
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetMessage());
  }, [location, dispatch]);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh] ">
      <Routes>
        <Route element={<Layout></Layout>}>
          <Route path={"/"} element={<Home></Home>}></Route>
          <Route path="/profile/:id" element={<Profile></Profile>}></Route>
        </Route>

        <Route path="/register" index element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route
          path="/reset-password"
          element={<ResetPassword></ResetPassword>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
