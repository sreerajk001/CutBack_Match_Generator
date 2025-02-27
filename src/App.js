import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const teams = ["CSE", "EEE", "ECE", "MECH", "MCA", "B.ARCH", "ROBOTICS", "CIVIL"];
  const roundsPerTeam = 3;
  const matchesPerRound = teams.length / 2; // 8 teams → 4 matches per round

  const [matches, setMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [showFinalSchedule, setShowFinalSchedule] = useState(false);
  const scheduleRef = useRef(null); // Reference for capturing image

  useEffect(() => {
    setMatches([]); // Ensure matches are empty on reload
    setCurrentRound(0); // Reset round count
    setShowFinalSchedule(false); // Ensure final schedule is hidden
  }, []);

  const generateMatches = () => {
    let matchList = [];
    let usedMatches = new Set();
    let teamMatchCount = {}; // Tracks how many matches each team has played

    teams.forEach(team => (teamMatchCount[team] = 0));

    for (let round = 0; round < roundsPerTeam; round++) {
      let availableTeams = [...teams]; // Copy team list for pairing
      let roundMatches = [];

      while (roundMatches.length < matchesPerRound) {
        availableTeams.sort(() => Math.random() - 0.5); // Shuffle teams

        let team1 = availableTeams.pop();
        let team2 = availableTeams.pop();

        let matchKey = `${team1} vs ${team2}`;
        let reverseMatchKey = `${team2} vs ${team1}`;

        if (
          usedMatches.has(matchKey) ||
          usedMatches.has(reverseMatchKey) ||
          teamMatchCount[team1] >= roundsPerTeam ||
          teamMatchCount[team2] >= roundsPerTeam
        ) {
          availableTeams.push(team1, team2); // Put teams back and retry
          continue;
        }

        roundMatches.push({ team1, team2 });
        usedMatches.add(matchKey);
        usedMatches.add(reverseMatchKey);
        teamMatchCount[team1]++;
        teamMatchCount[team2]++;
      }

      matchList.push(roundMatches);
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

  const downloadScheduleAsImage = () => {
    if (scheduleRef.current) {
      html2canvas(scheduleRef.current).then(canvas => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "match_schedule.png";
        link.click();
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
  <h1>CUTBACK ROUND MATCHES</h1>

  {/* Download Button Positioned at the Top-Right */}
  {matches.length > 0 && showFinalSchedule && (
    <button onClick={downloadScheduleAsImage} className="download-btn">Download Schedule</button>
  )}

  {matches.length === 0 ? (
    <button onClick={generateMatches}>Generate Matches</button>
  ) : showFinalSchedule ? (
    <>
      <h2>Final Match Schedule</h2>
      <div ref={scheduleRef} className="all-rounds">
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
        {matches[currentRound - 1]?.map((match, index) => (
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
