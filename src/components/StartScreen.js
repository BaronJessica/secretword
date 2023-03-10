import "./StartScreen.css";

function StartScreen({ startGame }) {
  return (
    <div className="start">
      <h1>Secret Word</h1>
      <p>Clique no botao abaixo para começar a jogar</p>
      <button onClick={startGame}>Comecar o jogo</button>
    </div>
  );
}

export default StartScreen;
