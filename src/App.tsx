import { useState } from 'react';
import { DndContext, useDraggable, type DragEndEvent } from '@dnd-kit/core';
import { Draggable, DraggableOverlay, Droppable } from './components';
import { shuffleArray } from './utils';
import { GAME_CARDS, GAME_CELLS, GAME_CELLS_HEADER, GAME_CELLS_LINES_NAMES, type Card, type Cell } from './constants';

import './App.css'

export type DraggableItemProps = {
  card: Card
  showResult: boolean
}

function DraggableItem({ card, showResult }: DraggableItemProps) {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: card.id, disabled: showResult
  });

  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    >{card.content}</Draggable>
  );
}

const App = () => {
  const [cells, setCells] = useState<Cell[]>(GAME_CELLS);
  const [cards, setCards] = useState<Card[]>(shuffleArray(GAME_CARDS));
  const [showTable, setShowTable] = useState(false)
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false)

  const handleShuffle = () => {
    setCards([...shuffleArray(cards)])
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
    <div>
      <h1>DER DIE DAS DEM</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DndContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={event => {
            handleDropItem(event)
            setIsDragging(false);
          }}
          onDragCancel={() => setIsDragging(false)}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {cards.map((card) => {
              if (card.cellId) return null

              return <DraggableItem key={card.id} card={card} showResult={showResult} />
            })}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            gridTemplateAreas: `
            'header0 header1 header2 header3'
            'lineName1 cell cell cell'
            'lineName2 cell cell cell'
            'lineName3 cell cell cell'
            'lineName4 cell cell cell'
            `

          }}>
            {GAME_CELLS_HEADER.map(header => <b key={header.id} style={{ gridArea: header.id }}>{header.title}</b>)}
            {GAME_CELLS_LINES_NAMES.map(lineName => <b key={lineName.id} style={{ gridArea: lineName.id, textAlign: 'center', alignContent: 'center' }}>{lineName.title}</b>)}

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

          <DraggableOverlay />
        </DndContext>
        <div>
          <button onClick={handleShuffle}>SHUFFLE</button>
          <button onClick={handleCorrectResult}>CHECK RESULT</button>
          <button onClick={() => setShowTable(!showTable)}>TOGGLE RESULT TABLE</button>
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