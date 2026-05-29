import { useState,useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Column from './Column'
import Modal from './Modal'
import Row from './Row'
import Idmodal from './Idmodal'

function App() {
  // 弦の本数
  const stringNum = 4
  const position = useRef({x:null,y:null})
  const [column,setColumn] = useState({})
  const [row,setRow] = useState([])
  const [isOpen,setIsOpen] = useState(false)
  const [idModal,setIdModal] = useState(false)
  const [isDown,setIsDown] = useState(false)
  const [mouseup,setMouseup] = useState(false)
  const [selected,setSelected] = useState('')
  const [editingRow,setEditingRow] = useState(-1)
  const [selectedCell,setSelectedCell] = useState('')
  const [modalRow,setModalRow] = useState([])
  const [showCreate,setShowCreate] = useState(true)
  const [showLoding,setShowLoding] = useState(false)
  const [inputId,setInputId] = useState('')
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
  const [idScore,setIdScore] = useState([createNewRow()])
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
      <div className='hero-area'>
        <div className='explain-area'>
          <p>
            Reactを使って開発した、ブラウザ上で直感的にベースのタブ譜を作成・編集できるWebアプリケーションです。<br/>
            細かい譜面の書き方を知らない＆現状実装が技術的に困難な部分も多いため、
            リズム等が頭に入っている状態で運指の練習用に活用してください。<br />
          </p>
          <p className='note'>※スマートフォンで使用する場合横画面で使用してください。</p>
        </div>
        {/* フォームのリンク */}
        <div className='form-wrapper'>
          <a 
            href="https://docs.google.com/forms/d/e/1FAIpQLSep7f0JgzIMA8gSsLTyj_r-tvIzWQTH7RxIHNxp7jsXBcaLFA/viewform?usp=header" 
            className='form-link'
            target='_blank'
            rel='noopener noreferrer'
          >
            ご意見はこちらへ
          </a>
        </div>
        <div className='herobtn-area'>  
          <button
            type='button'
            className='hero-btn'
            onClick={()=>{
              setShowCreate(true)
              setShowLoding(false)
              setTimeout(()=>{
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                })  
              } ,10)
            }}
          >
            create score!
          </button>
          <button
            type='button'
            className='hero-btn'
            onClick={()=>{
              setShowCreate(false)
              setShowLoding(true)
              setIdModal(true)
            }}
          >
            loding score!
          </button>
        </div>
      </div>
      {idModal && <Idmodal
        idModal={idModal}
        setIdModal={setIdModal}
        inputId={inputId}
        setInputId={setInputId}
        setScore={setScore}
      />}
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
      {showCreate && <div className='create-area'>
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
          <div className='btn-row'>
            <button
              type='button'
              className='create-btn'
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
              className='create-btn'
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
              className='create-btn'
              onClick={()=>{
                if(editingRow === -1){
                  alert('削除する行を選択してください')
                  return
                }
                setScore(score.filter((item,index)=>{
                  return index !== editingRow
                }))
                setEditingRow((editingRow === score.length-1) ? editingRow-1 : editingRow)
              }}
            >
              delete row
            </button>
          </div>
          <div className='btn-row'>
            <button
              type='button'
              className='create-btn'
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
              className='create-btn'
              onClick={()=>{
                confirm('保存された譜面で現在の譜面を上書きします。よろしいですか？')
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
            <button
              type='button'
              className='create-btn'
              onClick={async()=>{
                const obj = JSON.stringify({score:score})
                try{
                  const res = await fetch('url',{
                    method: "POST",
                    headers:{
                      "Content-Type" : "application/json",
                    },
                    body:obj
                  })
                  if(res.ok){
                    throw new Error("サーバー側でエラーが発生しました")
                  }
                  const result = await res.json()
                  alert(`あなたの譜面IDは${result.id}です。この値を保存してください`)
                }catch(error){
                  console.log(error)
                  alert("サーバーとの通信に失敗しました。")
                }
              }}
            >
              upload this score
            </button>
          </div>
        </div>
      </div>}
      {showLoding && <div className='loading-area'>
                <div className='score-wrapper'>
          {idScore.map((item,index)=>{
              return <div 
                className='row-wrapper'
                key={index}
              >
                  <Row columns={item}></Row>
              </div>
            })}
        </div>
      </div>}
    </>
  )
}

export default App
