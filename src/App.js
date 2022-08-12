import "./styles.css";

const arr = Array.from({ length: 25 }, (e, i) => getNextRand(1, 5));

export default function App() {
  const grid = arr.map((el, i) => {
    const gm = (
      <span
        key={i}
        className={"gem " + colorByNum(el)}
        onClick={(event) => clickGem(event, i, el)}
      >
        &nbsp;
      </span>
    );
    return gm;
  });
  return <div className="App gems">{grid}</div>;
}

function colorByNum(num) {
  switch (num) {
    case 1:
      return "gem-red";
    case 2:
      return "gem-green";
    case 3:
      return "gem-blue";
    case 4:
      return "gem-purple";
    case 5:
      return "gem-pink";
    default:
      return "gem-empty";
  }
}

function getNextRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clickGem(event, index, gem) {
  console.log(event, index, gem);
  matchGems();
}

function matchGems() {
  const gemsLines = [];
  arr.forEach((gem, i) => {});
}
