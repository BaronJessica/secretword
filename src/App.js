import "./App.css";
import StartScreen from "./components/StartScreen";
import { useState, useEffect, useCallback } from "react";
import { wordsList } from "./data/words.js";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];
const qtyGuesses = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(qtyGuesses);
  const [score, setScore] = useState(0);

  const pickWordCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    //limpar todas as letras
    clearLettersStates();

    const { word, category } = pickWordCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordCategory]);

  //processa a letra inserida
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    //verifica se letra foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //insere a letra correta ou tira uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setGuessedLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const retry = () => {
    setScore(0);
    setGuesses(qtyGuesses);
    setGameStage(stages[0].name);
  };

  //verificação de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]; //itens únicos no array

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore += 10));
      //restart
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
  //verificar se as tentativas terminaram
  useEffect(() => {
    if (guesses <= 0) {
      //reseta os estagios
      clearLettersStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
