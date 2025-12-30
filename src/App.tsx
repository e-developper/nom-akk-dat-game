import { useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { DraggableOverlay, Droppable } from './components';
import { shuffleArray } from './utils';
import { GAME_CARDS, GAME_CELLS, GAME_CELLS_HEADER, GAME_CELLS_LINES_NAMES, type Card, type Cell } from './constants';
import DraggableItem from './components/draggableItem';

import './App.css'


const rdnCards = shuffleArray(GAME_CARDS)

const App = () => {
  const [cells, setCells] = useState<Cell[]>(GAME_CELLS);
  const [cards, setCards] = useState<Card[]>(rdnCards);
  const [showTable, setShowTable] = useState(false)
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false)

  const handleShuffle = () => {
    setCards([...shuffleArray(cards)])
  }

  const handleResetGame = () => {
    setShowResult(false)
    cards.forEach(card => delete card.cellId)
    handleShuffle()
  }

  const handleCorrectResult = () => {
    const newCells = cells.map(cell => {
      const card = cards.find(card => card.cellId === cell.id)

      cell.isValueCorrect = cell.answer === card?.value

      return cell
    })

    setCells(newCells)
    setShowResult(true)
  }

  const handleDropItem = ({ active, over }: DragEndEvent) => {
    if (cards.some(card => card.cellId === over?.id) && Boolean(over)) return

    const newCards = cards.map((card) => {
      if (card.id === active.id) {
        return { ...card, cellId: over?.id as string }
      }

      return card
    })

    setCards(newCards)
  }

  return (
    <div className="game">
      <h1>Die Artikel Spiele</h1>
      <div className="container">
        <DndContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={event => {
            handleDropItem(event)
            setIsDragging(false);
          }}
          onDragCancel={() => setIsDragging(false)}
        >
          <div className="non-classified-items">
            {cards.map((card) => {
              if (card.cellId) return null

              return <DraggableItem key={card.id} card={card} showResult={showResult} />
            })}
          </div>

          <div className="body">
            <div className="table">
              {GAME_CELLS_HEADER.map((header, index) => <b key={header.id} className={`header-${index}`}>{header.title}</b>)}
              {GAME_CELLS_LINES_NAMES.map((lineName, index) => <b key={lineName.id} className={`line line-name-${index}`}>{lineName.title}</b>)}

              {cells.map(cell => {
                const cellCards = cards.filter(card => card.cellId === cell.id);

                return (
                  <Droppable key={cell.id} cell={cell} dragging={isDragging} showResult={showResult}>
                    <span>{cell.title}</span>

                    {cellCards.map(card => (
                      <DraggableItem card={card} showResult={showResult} />
                    ))}
                  </Droppable>
                )
              })}
            </div>
            <footer className="footer">
              <button onClick={handleResetGame}>Reset Game</button>
              <button onClick={handleCorrectResult}>Finish game</button>
            </footer>
          </div>

          <DraggableOverlay />
        </DndContext>
        <div>
          {/* <button onClick={handleShuffle}>SHUFFLE</button> */}
          {/* <button onClick={() => setShowTable(!showTable)}>TOGGLE RESULT TABLE</button> */}
          {showTable && (
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Nom.</th>
                  <th>Akk.</th>
                  <th>Dat.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Mask.</b></td>
                  <td>der</td>
                  <td>de<b>n</b></td>
                  <td><b>dem</b></td>
                </tr>
                <tr>
                  <td><b>Fem.</b></td>
                  <td>die</td>
                  <td>die</td>
                  <td>de<b>r</b></td>
                </tr>
                <tr>
                  <td><b>Neutr.</b></td>
                  <td>das</td>
                  <td>das</td>
                  <td>da<b>m</b></td>
                </tr>
                <tr>
                  <td><b>Plural</b></td>
                  <td>die</td>
                  <td>die</td>
                  <td>de<b>n + n</b></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )

}

export default App