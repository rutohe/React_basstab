import { useState,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Column from './Column'
import Modal from './Modal'
import Row from './Row'

function App() {
  // 弦の本数
  const stringNum = 4
  const position = useRef({x:null,y:null})
  const [column,setColumn] = useState({})
  const [row,setRow] = useState([])
  const [isOpen,setIsOpen] = useState(false)
  const [isDown,setIsDown] = useState(false)
  const [mouseup,setMouseup] = useState(false)
  const [selected,setSelected] = useState('')
  const [editingRow,setEditingRow] = useState(-1)
  const [selectedCell,setSelectedCell] = useState('')
  const columnInRow = 40 //1つのrowに何個column入れるか
  //こっちで全体のcolumnを分割してrowに渡そう
  //row用のwrapper作っとこう
  const defaultColumn = {
    fret:new Array(stringNum),
    hammer_on:false,
    pull_off:false,//ここ二つをeffectで文字列で判別でもいいかも ex.effect:hammer_on
    bar:false
  }
  const createNewRow = () => {
    return Array.from({ length:columnInRow }, () => ({
      ...defaultColumn,
      fret: [...defaultColumn.fret] // 配列の中の配列もコピー（重要！）
    }))
  }
  
  const [score, setScore] = useState([createNewRow()])
  const defaultScore = {
    column:defaultColumn,
    columnInRow:columnInRow
  }
  const dragState ={
    isDown:isDown,
    setIsDown:setIsDown,
    mouseup:mouseup,
    setMouseup:setMouseup
  }
  const selectState = {
    selectedCell:selectedCell,
    setSelectedCell:setSelectedCell
  }
  return (
    <>
      <Modal
        IsOpen={isOpen}
        setIsOpen={setIsOpen}

        defaultScore={defaultScore}
        dragState={dragState}
        selectState={selectState}
        position={position}
        stringNum={stringNum}
      />
      {/* オブジェクトにして数減らしてみよう */}
      <div className='score-wrapper'>
         {score.map((item,index)=>{
            return <div 
              className={(index === editingRow) ? 'row-wrapper selectedRow' : 'row-wrapper'}
              key={index}
              onClick={()=>{return setEditingRow(index)}}
            >
                <Row columns={item}></Row>
            </div>
          })}
      </div>
      <button
        type='button'
        className='open-btn'
        onClick={()=>{setIsOpen(true)}}
      >
        edit this row
      </button>
      {/* insert rowのボタンも作る */}
      <button
        type='button'
        className='insert-btn'
        onClick={()=>{
          const next = (editingRow === -1) ? score.length : editingRow
          const ary = [...score]
          ary.splice(next, 0,createNewRow())
          setScore(ary)
          setEditingRow((editingRow === -1) ? next : next+1)
        }}
      >
        insert row
      </button>
      <button
        type='button'
        className='delete-btn'
        onClick={()=>{
          setScore(score.filter((item,index)=>{
            return index !== editingRow
          }))
          setEditingRow((editingRow === score.length-1) ? editingRow-1 : editingRow)
        }}
      >
        delete row
      </button>
    </>
  )
}

export default App
