import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import HeaderBar from "./components/HeaderBar/HeaderBar";
import Layout from "./hoc/Layout/Layout";
import PageRouter from "./hoc/PageRouter/PageRouter";

import { AuthContext } from "./context/AuthContext";
import { auth, onAuthStateChange } from "./services/firebase";

export const NO_COMPETITION = 0;

function App() {
  const [user, setUser] = useState({ signedIn: false });
  const [authStateReceived, setAuthStateReceived] = useState(false);
  const [compId, setCompId] = useState(NO_COMPETITION);
  const [competitionInfo, setCompetitionInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((userData) => {
      setUser(userData);
      setAuthStateReceived(true);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const parsedCompId = Number(
      localStorage.getItem("compId") || NO_COMPETITION
    );
    setCompId(parsedCompId);
  }, []);

  const fetchCompetitionInfo = async (fetchCall, stateKey) => {
    try {
      const data = await fetch(fetchCall).then((response) => response.json());
      return {
        [stateKey]: data,
      };
    } catch (e) {
      return {
        [stateKey]: undefined,
      };
    }
  };

  const isReadyForDataFetch = () => {
    if (!user.signedIn) return false;
    if (user.id === undefined || user.id === 0) return false;
    if (compId === NO_COMPETITION) return false;
    return true;
  };

  useEffect(() => {
    if (!authStateReceived) {
      return;
    }

    if (isReadyForDataFetch()) {
      setLoading(true);
      Promise.all([
        fetchCompetitionInfo(
          `./competitionInfo?user=${user.id}&competition=${compId}`,
          "generalInfo"
        ),
        fetchCompetitionInfo(
          `./recentBuys?competition=${compId}`,
          "recentBuys"
        ),
        fetchCompetitionInfo(
          `./investments?user=${user.id}&competition=${compId}`,
          "investments"
        ),
        fetchCompetitionInfo("./trending", "trending"),
        fetchCompetitionInfo(`./networths?competition=${compId}`, "networths"),
        fetchCompetitionInfo(
          `./rankedCompetitors?competition=${compId}`,
          "rankings"
        ),
      ]).then((resolvedData) => {
        setLoading(false);
        let newCompInfo = {};
        for (const response of resolvedData) {
          newCompInfo = {
            ...newCompInfo,
            ...response,
          };
        }
        setCompetitionInfo(newCompInfo);
      });
    }
  }, [user.id, authStateReceived]);

  const updateGeneralInfo = () => {
    fetchCompetitionInfo(
      `./competitionInfo?user=${user.id}&competition=${compId}`,
      "generalInfo"
    ).then((data) => {
      let newCompInfo = { ...competitionInfo };
      newCompInfo = { data, ...newCompInfo };
      console.log("UPDATING");
      console.log(newCompInfo);
      setCompetitionInfo(newCompInfo);
    });
  };

  return (
    <BrowserRouter>
      <div className="App">
        <AuthContext>
          <HeaderBar
            loggedIn={user.signedIn}
            innerNav={compId != NO_COMPETITION}
            updateCompId={setCompId}
          />
          <Layout>
            <PageRouter
              authStateReceived={authStateReceived}
              signedIn={user.signedIn}
              compId={compId}
              loading={loading}
              competitionInfo={competitionInfo}
              updateCompId={setCompId}
              updateGeneralInfo={updateGeneralInfo}
            />
          </Layout>
        </AuthContext>
      </div>
    </BrowserRouter>
  );
}

export default App;
