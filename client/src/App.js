import { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import {Room, Star} from '@material-ui/icons';
import './app.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import {format} from 'timeago.js';
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 29.3732,
    longitude: 78.1351,
    zoom: 4,
  });
  
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, [])

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    //it will center the map
    setViewport({...viewport, latitude:lat, longitude:long})
  }


  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    })
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  }


  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }
  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(viewport) => setViewport(viewport)}
        mapStyle="mapbox://styles/amitsharmaaa/ckspxh5m10rat17q1l6odepvr"
        onDblClick={handleAddClick}
        transitionDuration="500"
      >
      {pins.map((p) => (
        <>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 4}
            offsetTop={-viewport.zoom * 8}
          >
            <Room style={{fontSize:viewport.zoom * 8, color: p.username===currentUser ? "tomato" : "slateblue", cursor: "pointer"}} onClick={()=>handleMarkerClick(p._id, p.lat, p.long)}/>
          </Marker>
          {p._id === currentPlaceId && 
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left" 
              onClose={()=>setCurrentPlaceId(null)}>
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className="star"/>)}
                </div>
                <label>Information</label>
                <span className="username">Created by: <b>{p.username}</b></span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          }
        </>
      ))}
      {
        newPlace && (
        <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left" 
              onClose={()=>setNewPlace(null)}>
              <div>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="">Title</label>
                  <input type="text" placeholder="Enter Title" onChange={(e)=>setTitle(e.target.value)}/>
                  <label htmlFor="">Review</label>
                  <textarea placeholder="Anything for this location." onChange={(e)=>setDesc(e.target.value)}></textarea>
                  <label htmlFor="">Rating</label>
                  <select onChange={(e)=>setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" type="submit">Pin Now</button>
                </form>
              </div>
        </Popup>
        )
      }

      {
        currentUser ? (
          <button className="button logout" onClick={handleLogout}>SignOut</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={()=>setShowLogin(true)}>SignIn</button>
            <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
          </div>
        )
      }
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>}
      
      </ReactMapGL>
    </div>
  );
}

export default App;
