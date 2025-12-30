import type { ReactNode } from 'react'

export type Cell = {
  id: string
  title: string
  answer: string
  isValueCorrect?: boolean
}

export type Card = {
  id: string
  value: string
  content: ReactNode
  cellId?: string
}

export const GAME_CELLS: Cell[] = [
  { id: 'cell1', title: 'CELL A', answer: 'der' },
  { id: 'cell2', title: 'CELL B', answer: 'den' },
  { id: 'cell3', title: 'CELL C', answer: 'dem' },
  { id: 'cell4', title: 'CELL D', answer: 'die' },
  { id: 'cell5', title: 'CELL E', answer: 'die' },
  { id: 'cell6', title: 'CELL F', answer: 'der' },
  { id: 'cell7', title: 'CELL G', answer: 'das' },
  { id: 'cell8', title: 'CELL H', answer: 'das' },
  { id: 'cell9', title: 'CELL I', answer: 'dem' },
  { id: 'cell10', title: 'CELL J', answer: 'die' },
  { id: 'cell11', title: 'CELL K', answer: 'die' },
  { id: 'cell12', title: 'CELL L', answer: 'den+n' },
]

export const GAME_CELLS_HEADER = [
  { id: 'header0', title: '' },
  { id: 'header1', title: 'Nominativ' },
  { id: 'header2', title: 'Akkusativ' },
  { id: 'header3', title: 'Dativ' }
]

export const GAME_CELLS_LINES_NAMES = [
  { id: 'lineName1', title: 'Maskulinum' },
  { id: 'lineName2', title: 'Femininum' },
  { id: 'lineName3', title: 'Neutrum' },
  { id: 'lineName4', title: 'Plural' }
]

export const GAME_CARDS: Card[] = [
  {
    id: 'card1',
    value: 'der',
    content: <span>der </span>
  },
  {
    id: 'card2',
    value: 'den',
    content: <span>de <b className="highlight-article"> n </b></span >
  },
  {
    id: 'card3',
    value: 'dem',
    content: <b className="highlight-article"> dem </b>
  },
  {
    id: 'card4',
    value: 'die',
    content: <span>die </span>
  },
  {
    id: 'card5',
    value: 'die',
    content: <span>die </span>
  },
  {
    id: 'card6',
    value: 'der',
    content: <span>de <b className="highlight-article"> r </b></span >
  },
  {
    id: 'card7',
    value: 'das',
    content: <span>das </span>
  },
  {
    id: 'card8',
    value: 'das',
    content: <span>das </span>
  },
  {
    id: 'card9',
    value: 'dem',
    content: <span>de <b className="highlight-article"> m </b></span >
  },
  {
    id: 'card10',
    value: 'die',
    content: <span>die </span>
  },
  {
    id: 'card11',
    value: 'die',
    content: <span>die </span>
  },
  {
    id: 'card12',
    value: 'den+n',
    content: <span>de <b className="highlight-article"> n + n </b></span >
  },
]