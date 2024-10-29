/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const CarShuffle = ({ cars, onGuess, currentCar, scrambledCar }) => {
  const [playerResponse, setPlayerResponse] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuess(playerResponse);
    setPlayerResponse('');
  };

  return (
    <div>
      <p id="car" style={{ textAlign: 'center' }}>{scrambledCar}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playerResponse}
          onChange={(e) => setPlayerResponse(e.target.value)}
        />
      </form>
    </div>
  );
};

const CarScore = ({ points, strikes }) => {
  return (
    <div>
      <div className="points">{points} points</div>
      <div className="strikes">{strikes} strikes</div>
    </div>
  );
};

const CarPass = ({ remainingPasses, onUsePass }) => {
  return (
    <div>
      <button onClick={onUsePass} disabled={remainingPasses <= 0}>
        Pass ({remainingPasses} left)
      </button>
    </div>
  );
};

const App = () => {
  const [score, setScore] = React.useState(0);
  const [strokes, setStrokes] = React.useState(0);
  const [attempts, setAttempts] = React.useState(3);
  const [selectedCar, setSelectedCars] = React.useState(null);
  const [currentCar, setCurrentCar] = React.useState(null);
  const [scrambledCar, setScrambledCar] = React.useState('');
  const [usedCars, setUsedCars] = React.useState([]);
  const [passRemainders, setPassRemainders] = React.useState(3);

  const cars = [
    "Audi", "BMW", "Chevrolet", "Dodge", "Ford",
    "Honda", "Hyundai", "Kia", "Lexus", "Mazda",
  ];

  React.useEffect(() => {
    loadUsedCars();
    chooseCar();

    if (allCarsUsed()) {
      endGame();
    }
  }, []);

  const loadUsedCars = () => {
    const storedCars = localStorage.getItem('usedCars');
    if (storedCars) {
      setUsedCars(JSON.parse(storedCars));
    }
  };

  const saveUsedCars = () => {
    localStorage.setItem('usedCars', JSON.stringify(usedCars));
  };

  const chooseCar = () => {
    const randomIndex = Math.floor(Math.random() * cars.length);
    const chosenCar = cars[randomIndex];
  
    if (!usedCars.includes(chosenCar)) {
      const scrambled = shuffle(chosenCar);
      
      setCurrentCar(chosenCar);
      setScrambledCar(scrambled);
      setUsedCars([...usedCars, chosenCar]);
      saveUsedCars();
    } else {
      chooseCar();
    }
  };
  

  const usePass = () => {
    if (passRemainders > 0) {
      setPassRemainders(passRemainders - 1);
      chooseCar();
    } else {
      alert("No passes left!");
    }
  };

  const checkAnswer = (guess) => {
    if (guess.toLowerCase() === currentCar.toLowerCase()) {
      setScore(score + 1);
      alert('Correct!');
      
      if (usedCars.length === cars.length) {
        endGame();
      } else {
        chooseCar();
      }
    } else {
      setStrokes(strokes + 1);
      alert(`Incorrect. The correct answer was ${currentCar}.`);
      
      if (strokes >= attempts) {
        endGame();
      } else {
        chooseCar();
      }
    }
  };

  const allCarsUsed = () => {
    return usedCars.length === cars.length;
  };

  const endGame = () => {
    alert(`Game over! Your final score is ${score} points.`);
    setScore(0);
    setStrokes(0);
    setAttempts(3);
    chooseCar();
  };

  return (
    <div className="container">
      <h1>Welcome to CarShuffle</h1>
      <CarScore points={score} strokes={strokes}/>
      <CarShuffle 
        cars={cars}
        onGuess={checkAnswer}
        currentCar={currentCar}
        scrambledCar={scrambledCar}
      />
      <CarPass remainingPasses={passRemainders} onUsePass={usePass}/>
    </div>
  );
};

const container = document.getElementById("app");
const root = ReactDOM.createRoot(container);

root.render(<App />);