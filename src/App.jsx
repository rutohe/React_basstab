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
  const [modalRow,setModalRow] = useState([])
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
      fret: [...defaultColumn.fret] // スプレッド構文で配列の住所変えてるから1使えたら全部変わることを防いでるらしい
    }))
  }
  
  const [score, setScore] = useState([createNewRow()])
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
      {isOpen && <Modal
        setIsOpen={setIsOpen}
        modalRow={modalRow}
        setModalRow={setModalRow}

        dragState={dragState}
        selectState={selectState}
        position={position}
        stringNum={stringNum}
        score={score}
        setScore={setScore}
        editingRow={editingRow}
      />}
      {/* オブジェクトにして数減らしてみよう */}
      <div className='score-wrapper'>
         {score.map((item,index)=>{
            return <div 
              className={(index === editingRow) ? 'row-wrapper selectedRow' : 'row-wrapper'}
              key={index}
              onClick={()=>{return (editingRow === index) ? setEditingRow(-1) : setEditingRow(index)}}
            >
                <Row columns={item}></Row>
            </div>
          })}
      </div>
      <div className="btn-wrapper">
        <button
          type='button'
          className='open-btn'
          onClick={()=>{
            if(editingRow === -1){
              alert('編集行を選択してください。')
              return
            }
            setModalRow(score[editingRow].map((item,index)=>{
              return {
                ...item,
                fret:[...item.fret]
              }
            }))
            setIsOpen(true)
          }}
        >
          edit this row
        </button>
        {/* insert rowのボタンも作る */}
        <button
          type='button'
          className='insert-btn'
          onClick={()=>{
            const next = (editingRow === -1) ? score.length : editingRow+1
            const ary = [...score]
            ary.splice(next, 0,createNewRow())
            setScore(ary)
            setEditingRow(next)
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
        <button
          type='button'
          className='keep-btn'
          onClick={()=>{
            const obj = JSON.stringify({score:score})
            localStorage.setItem("score",obj)
            alert("ローカルストレージに譜面を保存しました。")
          }}
        >
          keep this score
        </button>
        <button
          type='button'
          onClick={()=>{
            const saveData = localStorage.getItem("score")
            if(saveData){
              const parsed = JSON.parse(saveData)
              setScore(parsed.score)
              return
            }
            alert('保存された譜面がありません。白紙の譜面を作成します')
            setScore([createNewRow()])
          }}
        >
          reload latest score
        </button>
      </div>
    </>
  )
}

export default App
