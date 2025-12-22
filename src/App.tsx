import { useState, type ReactNode } from 'react';
import { DndContext, useDraggable, type DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core';
import { Draggable, DraggableOverlay, Droppable } from './components';

type DraggableItemProps = {
  id: string
  content: ReactNode
  cellId?: string
}

function DraggableItem({ id, content }: DraggableItemProps) {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id
  });

  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    >{content}</Draggable>
  );
}

function App() {
  const [cells] = useState([
    { id: 'cell1', title: 'CELL A' },
    { id: 'cell2', title: 'CELL B' },
    { id: 'cell3', title: 'CELL C' },
    { id: 'cell4', title: 'CELL D' },
    { id: 'cell5', title: 'CELL E' },
    { id: 'cell6', title: 'CELL F' },
    { id: 'cell7', title: 'CELL G' },
    { id: 'cell8', title: 'CELL H' },
    { id: 'cell9', title: 'CELL I' },
    { id: 'cell10', title: 'CELL J' },
    { id: 'cell11', title: 'CELL K' },
    { id: 'cell12', title: 'CELL L' },
  ]);

  const [cards, setCards] = useState([
    { id: 'card1', content: <span>der</span>, cellId: 'cell1' },
    { id: 'card2', content: <span>de<b style={{ backgroundColor: 'lightsalmon' }}>n</b></span>, cellId: 'cell2' },
    { id: 'card3', content: <span><b style={{ backgroundColor: 'lightsalmon' }}>dem</b></span>, cellId: 'cell3' },
    { id: 'card4', content: <span>die</span>, },
    { id: 'card5', content: <span>die</span>, },
    { id: 'card6', content: <span>de<b style={{ backgroundColor: 'lightsalmon' }}>r</b></span>, },
    { id: 'card7', content: <span>das</span>, },
    { id: 'card8', content: <span>das</span>, },
    { id: 'card9', content: <span>de<b style={{ backgroundColor: 'lightsalmon' }}>m</b></span>, },
    { id: 'card10', content: <span>die</span>, },
    { id: 'card11', content: <span>die</span>, },
    { id: 'card12', content: <span>de<b style={{ backgroundColor: 'lightsalmon' }}>n + n</b></span>, },
  ]);
  const [parent, setParent] = useState<UniqueIdentifier | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDropItem = ({ active, over }: DragEndEvent) => {
    console.log('active, over', active, over)

    if (cards.some(card => card.cellId === over?.id)) return

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
      <h1>DER DIE DAS DEM {parent}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DndContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={event => {
            handleDropItem(event)
            setParent(event.over ? event.over.id : null);
            setIsDragging(false);
          }}
          onDragCancel={() => setIsDragging(false)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cards.map((card) => {
              if (card.cellId) return null

              return <DraggableItem {...card} />
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', border: '1px solid black' }}>

            {cells.map(cell => {
              const cellCards = cards.filter(card => card.cellId === cell.id);

              return (
                <Droppable key={cell.id} id={cell.id} dragging={isDragging}>
                  <span>{cell.title}</span>

                  {cellCards.map(card => (
                    <DraggableItem {...card} />
                  ))}
                </Droppable>
              )
            })}
          </div>
          <DraggableOverlay />
        </DndContext>
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
      </div>
    </div>
  )

}

export default App