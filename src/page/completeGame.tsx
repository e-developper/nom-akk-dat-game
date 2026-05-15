import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router';
import { GAME_CARDS, GAME_CELLS, GAME_CELLS_HEADER, GAME_CELLS_LINES_NAMES, type Card, type Cell } from '../constants';
import { shuffleArray } from '../utils';

const createInitialCards = (): Card[] =>
  shuffleArray([...GAME_CARDS]).map((card, index) => ({
    ...card,
    cellId: GAME_CELLS[index].id,
  }))

const createInitialCells = (): Cell[] =>
  GAME_CELLS.map(cell => ({ ...cell, isValueCorrect: undefined }))

const CompleteGame = () => {
  const { players: playersParam } = useParams<{ players: string }>()
  const players = playersParam === '2' ? 2 : 1 as 1 | 2

  const [cells, setCells] = useState<Cell[]>(createInitialCells)
  const [cards, setCards] = useState<Card[]>(createInitialCards)
  const [showResult, setShowResult] = useState(false)
  const [pendingCardIds, setPendingCardIds] = useState<Set<string>>(new Set())
  const [revealedCardIds, setRevealedCardIds] = useState<Set<string>>(new Set())
  const [lockedCardIds, setLockedCardIds] = useState<Set<string>>(new Set())
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1)
  const decisionDialogRef = useRef<HTMLDialogElement>(null)
  const resetDialogRef = useRef<HTMLDialogElement>(null)

  const awaitingDecision = revealedCardIds.size === 2 ? [...revealedCardIds] : null
  const allLocked = lockedCardIds.size === cards.length

  const scores = showResult
    ? cards.reduce(
      (acc, card) => {
        if (!card.playedBy) return acc
        const cell = cells.find(c => c.id === card.cellId)
        if (cell?.isValueCorrect) acc[card.playedBy]++
        return acc
      },
      { 1: 0, 2: 0 } as Record<1 | 2, number>
    )
    : null

  useEffect(() => {
    if (awaitingDecision) {
      decisionDialogRef.current?.showModal()
    } else {
      decisionDialogRef.current?.close()
    }
  }, [awaitingDecision])

  const nextPlayer = useCallback(() => {
    if (players === 2) setCurrentPlayer(prev => prev === 1 ? 2 : 1)
  }, [players])

  const handleSelectCard = useCallback((id: string) => {
    if (lockedCardIds.has(id)) return

    setPendingCardIds(prev => {
      if (prev.has(id)) return prev

      const next = new Set(prev)
      next.add(id)

      if (next.size === 2) {
        setRevealedCardIds(new Set(next))
        return new Set()
      }

      return next
    })
  }, [lockedCardIds])

  const handleKeep = useCallback(() => {
    if (!awaitingDecision) return
    const [firstId, secondId] = awaitingDecision
    setCards(prev => prev.map(card => {
      if (card.id === firstId || card.id === secondId) return { ...card, playedBy: currentPlayer }
      return card
    }))
    setLockedCardIds(prev => new Set([...prev, firstId, secondId]))
    setRevealedCardIds(new Set())
    nextPlayer()
  }, [awaitingDecision, currentPlayer, nextPlayer])

  const handleSwap = useCallback(() => {
    if (!awaitingDecision) return
    const [firstId, secondId] = awaitingDecision

    setCards(prev => {
      const first = prev.find(c => c.id === firstId)
      const second = prev.find(c => c.id === secondId)
      if (!first || !second) return prev

      return prev.map(card => {
        if (card.id === firstId) return { ...card, cellId: second.cellId, playedBy: currentPlayer }
        if (card.id === secondId) return { ...card, cellId: first.cellId, playedBy: currentPlayer }
        return card
      })
    })

    setLockedCardIds(prev => new Set([...prev, firstId, secondId]))
    setRevealedCardIds(new Set())
    nextPlayer()
  }, [awaitingDecision, currentPlayer, nextPlayer])

  // Lock the kept card, hide the other — it goes back into the game
  const handleHideOne = useCallback((hideId: string) => {
    if (!awaitingDecision) return
    const keepId = awaitingDecision.find(id => id !== hideId)!

    setCards(prev => prev.map(card => {
      if (card.id === keepId) return { ...card, playedBy: currentPlayer }
      return card
    }))
    setLockedCardIds(prev => new Set([...prev, keepId]))
    setRevealedCardIds(new Set())
    nextPlayer()
  }, [awaitingDecision, currentPlayer, nextPlayer])

  const handleHide = useCallback(() => {
    if (!awaitingDecision) return
    setRevealedCardIds(new Set())
    nextPlayer()
  }, [awaitingDecision, nextPlayer])

  const handleConfirmReset = useCallback(() => {
    resetDialogRef.current?.close()
    setShowResult(false)
    setCurrentPlayer(1)
    setPendingCardIds(new Set())
    setRevealedCardIds(new Set())
    setLockedCardIds(new Set())
    setCells(createInitialCells())
    setCards(createInitialCards())
  }, [])

  const handleFinishGame = useCallback(() => {
    const newCells = cells.map(cell => {
      const card = cards.find(c => c.cellId === cell.id)
      return { ...cell, isValueCorrect: cell.answer === card?.value }
    })
    setCells(newCells)
    setShowResult(true)
  }, [cells, cards])

  // Labels for the two revealed cards shown in the dialog
  const revealedCardValues = awaitingDecision
    ? awaitingDecision.map(id => cards.find(c => c.id === id)?.value ?? '?')
    : []

  return (
    <div className="complete-game">
      <div className="players-panel">
        <div className={classNames('player-card', {
          'player-card--active': currentPlayer === 1 && !showResult,
          'player-card--finished': showResult && scores?.[1] === scores?.[2],
          'player-card--winner': showResult && scores !== null && scores[1] > (players === 2 ? scores[2] : -1),
        })}>
          <span className="player-card__label">{players === 2 ? 'Player 1' : 'Player'}</span>
          {scores && <span className="player-card__score">{scores[1]} pts</span>}
        </div>

        {players === 2 && (
          <div className={classNames('player-card', {
            'player-card--active': currentPlayer === 2 && !showResult,
            'player-card--finished': showResult && scores?.[1] === scores?.[2],
            'player-card--winner': showResult && scores !== null && scores[2] > scores[1],
          })}>
            <span className="player-card__label">Player 2</span>
            {scores && <span className="player-card__score">{scores[2]} pts</span>}
          </div>
        )}
      </div>

      <div className="body">
        <div className="table">
          {GAME_CELLS_HEADER.map((header, index) => (
            <b key={header.id} className={`header-${index}`}>{header.title}</b>
          ))}
          {GAME_CELLS_LINES_NAMES.map((lineName, index) => (
            <b key={lineName.id} className={`line line-name-${index}`}>{lineName.title}</b>
          ))}

          {cells.map(cell => {
            const cellCard = cards.find(card => card.cellId === cell.id)
            const isLocked = cellCard ? lockedCardIds.has(cellCard.id) : false
            const isRevealed = cellCard
              ? showResult || isLocked || revealedCardIds.has(cellCard.id)
              : false
            const isPending = cellCard
              ? pendingCardIds.has(cellCard.id) || revealedCardIds.has(cellCard.id)
              : false
            const isSelectable = cellCard
              ? !showResult && !isLocked && !awaitingDecision && !isPending
              : false

            return (
              <div
                key={cell.id}
                className={classNames('droppable', {
                  'correct-answer': cell.isValueCorrect && showResult,
                  'not-correct-answer': cell.isValueCorrect === false && showResult,
                })}
                aria-label="Cell"
              >
                {cellCard && (
                  <button
                    className={classNames('complete-card', {
                      'complete-card--hidden': !isRevealed,
                      'complete-card--pending': isPending,
                      'complete-card--locked': isLocked || showResult,
                      'complete-card--row-1': cell.row === 1,
                      'complete-card--row-2': cell.row === 2,
                      'complete-card--row-3': cell.row === 3,
                      'complete-card--row-4': cell.row === 4,
                    })}
                    onClick={isSelectable ? () => handleSelectCard(cellCard.id) : undefined}
                    disabled={!isSelectable && !isRevealed && !isPending}
                  >
                    {isRevealed ? cellCard.content : '?'}
                    {isLocked && cellCard.playedBy && players === 2 && (
                      <span className={`player-badge player-badge--${cellCard.playedBy}`}>
                        P{cellCard.playedBy}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <dialog ref={decisionDialogRef} className="decision-dialog">
          <p>What do you want to do with these cards?</p>
          <div className="decision-dialog__actions">
            <button onClick={handleSwap}>Swap positions</button>
            <button onClick={handleKeep}>Keep both</button>
            <button onClick={handleHide}>Hide both</button>
          </div>
          <p className="decision-dialog__subtitle">Or hide one and keep the other:</p>
          <div className="decision-dialog__actions">
            {awaitingDecision && awaitingDecision.map((id, i) => (
              <button key={id} onClick={() => handleHideOne(id)}>
                Hide card {i + 1} <span className="decision-dialog__card-value">({revealedCardValues[i]})</span>
              </button>
            ))}
          </div>
        </dialog>

        <dialog ref={resetDialogRef} className="decision-dialog">
          <p>Are you sure you want to restart the game?</p>
          <div className="decision-dialog__actions">
            <button onClick={handleConfirmReset}>Restart</button>
            <button onClick={() => resetDialogRef.current?.close()}>Cancel</button>
          </div>
        </dialog>

        <footer className="footer">
          <button onClick={() => resetDialogRef.current?.showModal()}>Reset Game</button>
          <button onClick={handleFinishGame} disabled={showResult || !allLocked}>Finish Game</button>
        </footer>
      </div>
    </div>
  )
}

export default CompleteGame
