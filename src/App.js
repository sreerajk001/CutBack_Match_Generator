import { useState } from "react";
import "./App.css";

function App() {
  const teams = ["CSE", "EEE", "ECE", "MECH", "MCA", "B.ARCH", "ROBOTICS", "CIVIL"];
  const [matches, setMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [showFinalSchedule, setShowFinalSchedule] = useState(false);
  const roundsPerTeam = 3;

  // Function to shuffle an array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const generateMatches = () => {
    let shuffledTeams = shuffleArray([...teams]);
    let matchList = [];
    let playedMatches = new Set();

    // Generate 3 rounds
    for (let round = 0; round < roundsPerTeam; round++) {
      let roundMatches = [];
      let usedTeams = new Set();

      for (let i = 0; i < teams.length; i += 2) {
        let team1 = shuffledTeams[i];
        let team2 = shuffledTeams[i + 1];

        // Ensure unique matchups
        while (playedMatches.has(`${team1} vs ${team2}`) || usedTeams.has(team1) || usedTeams.has(team2)) {
          shuffleArray(shuffledTeams);
          team1 = shuffledTeams[i];
          team2 = shuffledTeams[i + 1];
        }

        roundMatches.push({ team1, team2 });
        playedMatches.add(`${team1} vs ${team2}`);
        playedMatches.add(`${team2} vs ${team1}`);
        usedTeams.add(team1);
        usedTeams.add(team2);
      }

      matchList.push(roundMatches);
      shuffledTeams = shuffleArray([...teams]); // Reshuffle for next round
    }

    setMatches(matchList);
    setCurrentRound(1);
    setShowFinalSchedule(false);
  };

  const nextRound = () => {
    if (currentRound < roundsPerTeam) {
      setCurrentRound(currentRound + 1);
    } else {
      setShowFinalSchedule(true);
    }
  };

  const prevRound = () => {
    if (showFinalSchedule) {
      setShowFinalSchedule(false);
      setCurrentRound(roundsPerTeam);
    } else if (currentRound > 1) {
      setCurrentRound(currentRound - 1);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CUTBACK ROUND MATCHES</h1>
        {matches.length === 0 ? (
          <button onClick={generateMatches}>Generate Matches</button>
        ) : showFinalSchedule ? (
          <>
            <h2>Final Match Schedule</h2>
            <div className="all-rounds">
              {matches.map((roundMatches, roundIndex) => (
                <div key={roundIndex} className="round">
                  <h3>Round {roundIndex + 1}</h3>
                  <ul className="match-list">
                    {roundMatches.map((match, index) => (
                      <li key={index}>
                        {match.team1} vs {match.team2}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button onClick={prevRound} className="back-btn">Back to Last Round</button>
          </>
        ) : (
          <>
            <h2>Round {currentRound}</h2>
            <ul className="match-list">
              {matches[currentRound - 1].map((match, index) => (
                <li key={index}>
                  {match.team1} vs {match.team2}
                </li>
              ))}
            </ul>

            <div className="button-container">
              <button onClick={prevRound} disabled={currentRound === 1}>Back</button>
              <button onClick={nextRound}>
                {currentRound === roundsPerTeam ? "Show Final Schedule" : "Next"}
              </button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
