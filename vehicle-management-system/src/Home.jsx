import React from "react";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ViewVehicles from "./Components/ViewVehicles/ViewVehicles";

const Home = () => {
  return (
    <>
      <Navbar />
      <ViewVehicles />
      <Footer />
    </>
  );
};

export default Home;
