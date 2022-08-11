import "./styles.css";

const arr = [
  1,
  2,
  4,
  5,
  4,
  3,
  3,
  3,
  1,
  2,
  4,
  4,
  1,
  3,
  4,
  1,
  2,
  3,
  2,
  2,
  3,
  5,
  5,
  1,
  1
];

export default function App() {
  const grid = arr.map((el, i) => {
    const gm = (
      <span key={i} className={"gem " + colorByNum(el)}>
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
