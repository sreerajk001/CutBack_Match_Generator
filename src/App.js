import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./App.css";

function App() {
  const teams = ["CSE", "EEE", "ECE", "MECH", "MCA", "B.ARCH", "ROBOTICS", "CIVIL"];
  const roundsPerTeam = 3;
  const matchesPerRound = teams.length / 2;

  const [matches, setMatches] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [showFinalSchedule, setShowFinalSchedule] = useState(false);
  const scheduleRef = useRef(null);

  useEffect(() => {
    setMatches([]);
    setCurrentRound(0);
    setShowFinalSchedule(false);
  }, []);

  const generateMatches = () => {
    let matchList = [];
    let usedMatches = new Set();
    let teamMatchCount = {};
    
    teams.forEach(team => (teamMatchCount[team] = 0));

    for (let round = 0; round < roundsPerTeam; round++) {
      let availableTeams = [...teams];
      let roundMatches = [];

      while (roundMatches.length < matchesPerRound) {
        availableTeams.sort(() => Math.random() - 0.5);
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
          availableTeams.push(team1, team2);
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

  // const downloadScheduleAsImage = () => {
  //   if (scheduleRef.current) {
  //     html2canvas(scheduleRef.current).then(canvas => {
  //       const link = document.createElement("a");
  //       link.href = canvas.toDataURL("image/png");
  //       link.download = "match_schedule.png";
  //       link.click();
  //     });
  //   }
  // };

  const downloadScheduleAsImage = () => {
    if (scheduleRef.current) {
      html2canvas(scheduleRef.current, {
        scale: 2, // Higher resolution
        useCORS: true, // Fix missing images/fonts
        backgroundColor: "#000", // Set a white background
      }).then((canvas) => {
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
        <h1 className="title">CUTBACK ROUND MATCHES</h1>

        {matches.length > 0 && showFinalSchedule && (
          <button onClick={downloadScheduleAsImage} className="download-btn">
            Download Schedule
          </button>
        )}

        {matches.length === 0 ? (
          <button onClick={generateMatches} className="button">Generate Matches</button>
        ) : showFinalSchedule ? (
          <>
            <h2 className="subtitle">Final Match Schedule</h2>
            <div ref={scheduleRef} className="schedule-container">
              {matches.map((roundMatches, roundIndex) => (
                <div key={roundIndex} className="round">
                  <h3>Round {roundIndex + 1}</h3>
                  <div className="match-list">
                    {roundMatches.map((match, index) => (
                      <div key={index} className="match-box">
                        {match.team1} vs {match.team2}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={prevRound} className="back-btn">Back to Last Round</button>
          </>
        ) : (
          <>
            <h2 className="subtitle">Round {currentRound}</h2>
            <div className="match-list">
              {matches[currentRound - 1]?.map((match, index) => (
                <div key={index} className="match-box">
                  {match.team1} vs {match.team2}
                </div>
              ))}
            </div>

            <div className="button-container">
              <button onClick={prevRound} disabled={currentRound === 1} className="nav-btn">Back</button>
              <button onClick={nextRound} className="nav-btn">
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
