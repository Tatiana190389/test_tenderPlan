import React, { useState, useRef } from 'react';
import './style.css';
import counterQuotes from './counterQuotes';
let nextId = 0;

export default function ChipsInput() {
  let [state, setState] = useState([]);
  const [error, setError] = useState(false);
  const ref = useRef(null);

  function handleDelete(item) {
    setState(state.filter((i) => i !== item));
  }

  function onChange(e) {
    e.preventDefault();
    let chip = e.target.value;
    let quotes = counterQuotes(e.target.value);

    if (chip.startsWith(',')) {
      e.preventDefault();
      e.target.value = '';
    }

    if (chip.endsWith(',') && (quotes === 0 || quotes % 2 === 0)) {
      setState([...state, { id: nextId++, chip: chip.slice(0, -1), isEdit: false }]);
      e.target.value = '';
      setError(false);
    }
  }

  function handleBlur(e) {
    e.preventDefault();
    let quotes = counterQuotes(e.target.value);
    if (e.target.value.length > 0 && quotes % 2 !== 0) {
      setError(true);
    }
    if (e.target.value.length > 0 && (quotes === 0 || quotes % 2 === 0)) {
      setError(false);
      setState([...state, { id: nextId++, chip: e.target.value, isEdit: false }]);
      e.target.value = '';
    }
  }

  function startEditChip(id) {
    console.log(id);
    console.log(state);
    const newState = state.map((chip) => (chip.id === id ? { ...chip, isEdit: true } : chip));
    setState(newState);
  }

  function editChip(id, e) {
    const newState = state.map((chip) => (chip.id === id ? { ...chip, chip: e.target.value } : chip));
    setState(newState);
  }

  function editChipEnd(id) {
    let newChips = [];
    const newState = state.map((chip) => {
      if (chip.id === id && chip.chip.includes(',')) {
        chip.chip.split(',').forEach((element) => {
          newChips.push({ id: nextId++, chip: element, isEdit: false });
        });
      } else {
        newChips.push({ ...chip, isEdit: false });
      }
      return newChips;
    });

    setState(...newState);
  }

  const chipsList = state.map((chip, id) => {
    let chipElement;
    if (chip.isEdit) {
      chipElement = (
        <input
          className="update-chip"
          value={chip.chip}
          ref={ref}
          onChange={(e) => editChip(id, e)}
          onBlur={() => editChipEnd(id)}
        />
      );
    } else {
      chipElement = <span onClick={() => startEditChip(id)}>{chip.chip}</span>;
    }

    return (
      <li className="tag-item" key={chip.id}>
        {chipElement}
        <button className="button" type="button" onClick={() => handleDelete(chip)}>
          &times;
        </button>
      </li>
    );
  });

  return (
    <div className="wrapper">
      <ul className="list">
        {chipsList}
        <input className="input" placeholder="Введите ключевые слова" onChange={onChange} onBlur={handleBlur} />
      </ul>
      {error && <p className="mistake">Закройте кавычки с двух сторон</p>}
    </div>
  );
}
