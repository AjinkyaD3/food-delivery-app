import { useState, useEffect } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

const Home = () => {
  const [category, setCategory] = useState("All");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/restaurants/list/");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setRestaurants(data.data || []);
        console.log("✅ Fetched Restaurants:", data.data);
      } catch (error) {
        console.error("❌ Error fetching restaurants:", error);
        setRestaurants([]); 
      }
    };

    fetchRestaurants();
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
