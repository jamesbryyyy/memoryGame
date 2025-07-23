import { useEffect, useState } from "react";

type cardsType = {
  id: number;
  source: string;
  img: string;
  match: boolean;
  flipped: boolean;
};

const cardSource: Omit<cardsType, "id" | "flipped">[] = [
  { source: "src", img: "/img/pizza.png", match: false },
  { source: "src", img: "/img/burger.png", match: false },
  { source: "src", img: "/img/cream.png", match: false },
  { source: "src", img: "/img/shake.png", match: false },
  { source: "src", img: "/img/hotdog.png", match: false },
  { source: "src", img: "/img/fries.png", match: false },
];

function App() {
  const [cards, setCards] = useState<cardsType[]>([]);
  const [cardOne, setOne] = useState<cardsType | null>(null);
  const [cardTwo, setTwo] = useState<cardsType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [win, setWin] = useState(false);
  const[score,setScore] = useState(0)

  const shuffleCard = () => {
    const shuffled = [...cardSource, ...cardSource]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({
        ...card,
        id: Math.random(),
        flipped: false,
        match: false,
      }));

    setCards(shuffled);
    setOne(null);
    setTwo(null);
    setWin(false);
    setScore(0)
  };

  useEffect(() => {
    shuffleCard();
  }, []);

  const pickCards = (card: cardsType) => {
    if (disabled || card.flipped || card.match) return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );

    cardOne ? setTwo(card) : setOne(card);
  };

  useEffect(() => {
    if (cardOne && cardTwo) {
      setDisabled(true);
      if (cardOne.img === cardTwo.img) {
        setScore(prev=> prev+1)
        setCards((prev) =>
          prev.map((card) =>
            card.img === cardOne.img
              ? { ...card, match: true }
              : card
          )
        );
        setTimeout(() => {
          resetGame();
        }, 800);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === cardOne.id || card.id === cardTwo.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetGame();
        }, 500);
      }
    }
  }, [cardOne, cardTwo]);

  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.match)) {
      setWin(true);
    }
  }, [cards]);

  const resetGame = () => {
    setOne(null);
    setTwo(null);
    setDisabled(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-y-5 py-10 bg-gradient-to-br from-blue-100 to-purple-200">
      <p className="font-mono text-lg">Score: {score}</p>
      <button
        onClick={shuffleCard}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        🔄 New Game
      </button>

      {win && (
        <div className="text-3xl font-bold text-green-700 animate-bounce">
          🎉 You Win! ILOVEEYOUU LOVEE
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-32 h-40 perspective ${
              card.match ? "invisible" : ""
            }`}
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-preserve-3d ${
                card.flipped ? "rotate-y-180" : ""
              }`}
            >
              <img
                src={card.img}
                alt="front"
                className="absolute w-full h-full object-cover rounded shadow backface-hidden transform rotate-y-180"
              />
              <img
                src="/img/blank.png"
                alt="back"
                onClick={() => pickCards(card)}
                className="absolute w-full h-full object-cover rounded shadow backface-hidden cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
