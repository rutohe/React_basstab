import { useEffect } from 'react'
import Column from './Column'
import Row from './Row'
function Modal({IsOpen,setIsOpen,defaultScore,dragState,selectState,position,stringNum}) {
    const items = [...Array.from({length:22},(_,i)=>i),'x','h','p','|']
    const defaultRow = Array.from({length:defaultScore.columnInRow},(_,i)=>defaultScore.column)
    useEffect(()=>{
        if (!IsOpen || !dragState.isDown) return;
        const items = document.querySelectorAll('.overlay .row-wrapper .string')
        const rect = items[0].getBoundingClientRect()
        const dragCell = document.querySelector('.dragcell')
        let nearestCell = -1
        let prevNearest = -1
        const mousemoveEvent = (e)=>{
            const x = e.clientX
            const y = e.clientY
            dragCell.style.left = `${x}px`
            dragCell.style.top = `${y}px`
            prevNearest = nearestCell
            let dest = Math.pow(x-rect.left,2) + Math.pow(y-rect.top,2)
            items.forEach((item,index)=>{
                const eachRect = item.getBoundingClientRect()
                const eachDest = Math.pow(eachRect.x - x,2)+Math.pow(eachRect.y - y,2)
                if(dest > eachDest){
                    // destが遠いと反応しない感じでもいいかもしれない
                    dest = eachDest
                    nearestCell = index
                }
            })
            if(prevNearest !== -1 && items[prevNearest]){
                items[prevNearest].classList.remove('nearest')
            }
            if(nearestCell !== -1 && items[nearestCell]){
                items[nearestCell].classList.add('nearest')
            }
        }
        const mouseupEvent = () => {
            selectState.setSelectedCell('')
            dragState.setIsDown(false)
            const col = Math.floor(nearestCell/stringNum)
            const cell = nearestCell % stringNum

        }
        window.addEventListener('mousemove',mousemoveEvent)
        window.addEventListener('mouseup',mouseupEvent)
        return () => {
                window.removeEventListener('mousemove', mousemoveEvent)
                window.removeEventListener('mousemove', mouseupEvent)
                items.forEach(item => item.classList.remove('nearest'))
        }
        
    },[IsOpen, dragState.isDown])
    return (
    <>
        {IsOpen && <div 
                className="overlay"
                onClick={()=>{
                    if(!dragState.isDown && !dragState.mouseup){
                        setIsOpen(false)
                    }
                    dragState.setMouseup(false)
                }}
            >
            <div className='row-wrapper'>
                <Row 
                    columns={defaultRow}
                    onClick={(e)=>{e.stopPropagation()}}
                >

                </Row>
            </div>
            <div
                className="modal-content"
                onClick={(e)=>{e.stopPropagation()}}
            >
                {
                    items.map((item,index)=>{
                        return <div 
                                    key={index}
                                    className="parts"
                                    onMouseDown={(e)=>{
                                        selectState.setSelectedCell(item)
                                        dragState.setIsDown(true)
                                        position.current.x = e.clientX
                                        position.current.y = e.clientY
                                        dragState.setMouseup(true)
                                    }}
                                >
                                    {item}   
                                </div>
                    })
                }
                <div className={(dragState.isDown) ? 'dragcell' : 'dragcell nodisplay'}>{selectState.selectedCell}</div>
            </div>
            <button 
                    type="button"
                    className="submit-btn"
                    onClick={()=>{
                        setIsOpen(false)

                    }}
                >
                    submit this score
                </button>
        </div>}
    </>
  )
    
}
export default Modal