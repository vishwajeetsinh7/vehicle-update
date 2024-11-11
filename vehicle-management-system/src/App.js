
import "./App.css";
import Home from "./Home";
import Login from "./Components/LoginRegister/Login";
import Register from "./Components/LoginRegister/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewVehicles from "./Components/ViewVehicles/ViewVehicles";
import AddVehicle from "./Components/AddUpdateVehicle/AddVehicle";
import UpdateVehicle from "./Components/AddUpdateVehicle/UpdateVehicle";
import Servies from "./Services";
import AddService from "./Components/AddUpdateService/AddService";
import UpdateService from "./Components/AddUpdateService/UpdateService";

function App() {
  // const vehicleRegistrations = ['ABC123', 'XYZ789', 'LMN456'];

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/addVehicle" element={<AddVehicle />}></Route>
        <Route path="/updateVehicle/:id" element={<UpdateVehicle/>}></Route>
        <Route path="/services" element={<Servies/>}></Route>
        <Route path="/addService" element={<AddService/>}></Route>
        <Route path="/updateService/:id" element={<UpdateService/>}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

{
  /* 
      <Register />
      <AddVehicle />

<AddService vehicleRegistrations={vehicleRegistrations} /> */
}
