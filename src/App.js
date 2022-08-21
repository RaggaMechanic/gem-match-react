import React, { useState } from "react";
import "./styles.css";

class Gem {
  x = -1;
  y = -1;
  type = 0;
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }
}

const size = 8;

function createGems() {
  let x = 0,
    y = 0;
  return Array.from({ length: size * size }, (e, i) => {
    if (x === size) {
      x = 0;
      y++;
    }
    const gem = new Gem(x, y, getNextRand(1, 5));
    x++;
    return gem;
  });
}

function clearMatches(gems) {
  const matches = matchLines(gems);
  if (matches.length > 0) {
    const newGems = Object.assign([], gems);
    matches.flat().forEach((m, i) => {
      const gem = newGems.find((g) => g.x === m.x && g.y === m.y);
      if (gem) gem.type = 0; // getNextRand(1, 5)
    });
    return { needUpdate: true, newGems, matches };
  }

  return { needUpdate: false, newGems: gems };
}

export default function App() {
  const [gems, setGems] = useState([]);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState(null);

  const newGame = () => {
    console.log("newGame call");
    const nGems = createGems();
    setGems(nGems);
  };

  const dropGems = (gems) => {
    const swaps = getSwaps(gems);
    console.log("dropGems swaps:", swaps);
    swaps.forEach((s) => {
      const _gems = Object.assign([], gems);
      const gem = _gems.find((g) => g.x === s.from.x && g.y === s.from.y);
      const hole = _gems.find((g) => g.x === s.to.x && g.y === s.to.y);
      gem.type = s.to.type;
      hole.type = s.from.type;
      setGems(_gems);
    });
  };

  const updateGems = async (gems) => {
    console.log("updateGems call", gems);
    const { needUpdate, newGems, matches } = clearMatches(gems);
    if (needUpdate) {
      console.log("updateGems setGems", newGems);

      await wait(100);
      dropGems(newGems);
      await wait(500);
      fillGems(newGems);
      await wait(100);
      setGems(newGems);
      setPoints(
        matches
          .map((m) => m.length * m[0].type * 10)
          .reduce((c, n) => c + n, points)
      );
      await wait(500);
      await updateGems(gems);
    }
  };

  const onClick = (event, isEmpty, isSelected, el) => {
    if (isEmpty || isSelected) return;

    const _gems = Object.assign([], gems);
    if (selected != null && swapElements(el, selected, _gems)) {
      setSelected(null);
      return;
    }

    setSelected(el);
    setGems(_gems);
  };

  const grid = gems.map((el, i) => {
    const key = `${el.x}${el.y}`;
    const isEmpty = el.type === 0;
    const isSelected = selected === el;
    const className = `gem ${colorByNum(el.type)} 
      ${isSelected ? "selected" : ""}`;

    const gm = (
      <span
        key={key}
        className={className}
        onClick={(e) => onClick(e, isEmpty, isSelected, el)}
      >
        {key}
      </span>
    );
    return gm;
  });

  React.useEffect(() => {
    if (gems.length === 0) newGame();
    setTimeout(() => updateGems(gems), 200);
  });

  const style = {
    gridTemplateColumns: `repeat(${size}, 50px)`,
    gridTemplateRows: `repeat(${size}, 50px)`
  };

  return (
    <div className="App">
      <div className="gems" style={style}>
        {grid}
      </div>
      <button onClick={newGame}>newGame</button>
      <span className="points-value">{points}</span>
    </div>
  );
}

async function wait(time = 0) {
  return new Promise((res) => setTimeout(res, time));
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

function swapElements(el, selected, gems) {
  console.log(el, selected);

  const difX = Math.abs(el.x - selected.x) === 1 && el.y === selected.y;
  const difY = Math.abs(el.y - selected.y) === 1 && el.x === selected.x;

  if (difX || difY) {
    const from = gems.find((g) => g.x === selected.x && g.y === selected.y);
    const to = gems.find((g) => g.x === el.x && g.y === el.y);
    const old = from.type;
    from.type = to.type;
    el.type = old;
    return true;
  }

  return false;
}

function separateGems(gems) {
  let lines = [],
    cols = [];
  for (let i = 0; i < size; i++) {
    cols.push(gems.filter((g) => g.x === i));
    lines.push(gems.filter((g) => g.y === i));
  }
  return { lines, cols };
}

// simple
function matchLines(gems) {
  const matches = [];
  const { lines, cols } = separateGems(gems);
  const all = lines.concat(cols);

  all.forEach((line) => {
    let match = [];
    line.forEach((gem, i) => {
      const someType = (match[match.length - 1] || {}).type === gem.type;
      const last = i === line.length - 1;

      if (gem.type === 0) {
        if (match.length > 2) {
          matches.push(match);
        }
        match = [];
        return;
      }

      if (match.length === 0) {
        match = [gem];
        return;
      }

      if (someType) {
        match.push(gem);
      } else if (match.length > 2) {
        matches.push(match);
        match = [gem];
      } else {
        match = [gem];
      }

      if (match.length > 2 && last) {
        matches.push(match);
      }
    });
  });

  return matches;
}

function getSwaps(gems) {
  const _gems = Object.assign([], gems);
  const { cols } = separateGems(_gems);

  const canDrop = (col) => {
    const firstGemIndex = col.findIndex((g) => g.type !== 0);
    const holeAfterGemIndex = col.findLastIndex(
      (g, i) => g.type === 0 && i > firstGemIndex
    );
    console.log(
      "holes",
      col.filter((g) => g.type === 0)
    );
    console.log(firstGemIndex, holeAfterGemIndex);
    return firstGemIndex > -1 && holeAfterGemIndex > -1;
  };

  const swaps = [];
  cols.forEach((col) => {
    console.log(col, canDrop(col));
    while (canDrop(col)) {
      const lastHoleIndex = col.findLastIndex((g) => g.type === 0);
      const gemBeforeHoleIndex = col.findLastIndex(
        (g, i) => g.type !== 0 && i < lastHoleIndex
      );
      const hole = col[lastHoleIndex];
      const gem = col[gemBeforeHoleIndex];
      const swap = {
        from: { x: gem.x, y: gem.y, type: gem.type },
        to: { x: hole.x, y: hole.y, type: hole.type }
      };
      hole.type = swap.from.type;
      gem.type = swap.to.type;
      console.log("swap", swap);
      swaps.push(swap);
    }
  });
  return swaps;
}

function fillGems(gems) {
  const _gems = Object.assign([], gems);
  _gems.forEach((g) => {
    if (g.type === 0) g.type = getNextRand(1, 5);
  });
  return _gems;
}
