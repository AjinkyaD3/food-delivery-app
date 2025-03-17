import React, { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/restaurants/list/")
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurants:", error));
  }, []);

  return (
    <div>
      <Header />
      
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} restaurants={restaurants} />
      <AppDownload />
    </div>
  );
};

export default Home;
