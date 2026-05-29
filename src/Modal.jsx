import { useEffect } from 'react'
import Column from './Column'
import Row from './Row'
function Modal({setIsOpen,modalRow,setModalRow,dragState,selectState,position,stringNum,score,setScore,editingRow}) {
    const items = [...Array.from({length:22},(_,i)=>i),'x','h','p','|','delete']

    useEffect(()=>{
        if (!dragState.isDown) return;
        const isH = selectState.selectedCell === 'h'
        const isP = selectState.selectedCell === 'p'
        const isDelete = selectState.selectedCell === 'delete'
        const effectOr = (isH || isP)
        
        const items = isDelete ? document.querySelectorAll('.overlay .row-wrapper .effect-area, .overlay .row-wrapper .string') : effectOr
        ? document.querySelectorAll('.overlay .row-wrapper .effect-area') : document.querySelectorAll('.overlay .row-wrapper .string')
        
        if (items.length === 0) return;
        
        const rect = items[0].getBoundingClientRect()
        const dragCell = document.querySelector('.dragcell')
        let nearestCell = -1
        let prevNearest = -1
        const mousemoveEvent = (e)=>{
            const x = e.clientX
            const y = (e.pointerType === 'touch') ? e.clientY - 50 : e.clientY
            if (dragCell) {
                dragCell.style.left = `${x}px`
                dragCell.style.top = `${y}px`
            }
            prevNearest = nearestCell
            let dest = Math.pow(x-rect.left,2) + Math.pow(y-rect.top,2)
            items.forEach((item,index)=>{
                const eachRect = item.getBoundingClientRect()
                const eachDest = Math.pow(eachRect.x - x,2)+Math.pow(eachRect.y - y,2)
                if(dest > eachDest){
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
            const currentPart = selectState.selectedCell;
            const isBar = currentPart === '|'
            selectState.setSelectedCell('')
            dragState.setIsDown(false)
            if (nearestCell === -1) return;
            if(effectOr){
                setModalRow(modalRow.map((item,index)=>{
                    if (nearestCell !== index) return item
                    return {
                        ...item,
                        hammer_on: isH,
                        pull_off: isP
                    }
                }))
            }
            else if(isDelete){
                const totalElementsInCol = stringNum + 1;
                const col = Math.floor(nearestCell / totalElementsInCol);
                const isEf = (nearestCell % totalElementsInCol) === 0;

                setModalRow(modalRow.map((item,index)=>{
                    if (index !== col) return item;
                    
                    if (isEf) {
                        return { ...item, hammer_on: false, pull_off: false };
                    } else {
                        const cell = (nearestCell % totalElementsInCol) - 1;
                        return {
                            ...item,
                            bar:false,
                            fret: item.fret.map((it, idx) => {
                                return (cell === idx) ? null : it;
                            })
                        };
                    }
                }))
            }
            else if(isBar){
                const col = Math.floor(nearestCell / stringNum);

                setModalRow(modalRow.map((item, index) => {
                    if (col !== index) return item;
                    
                    return {
                        ...item,
                        fret: item.fret.map(()=>{return false}),
                        bar: item.bar ? false : true 
                    }
                }))
            }
            else{
                const col = Math.floor(nearestCell/stringNum)
                const cell = nearestCell % stringNum
                setModalRow(modalRow.map((item,index)=>{
                    return (col === index) ? 
                    {...item,bar:false,fret:item.fret.map((it,idx)=>{return (cell === idx) ? (isDelete) ? null : currentPart : it})} : item
                }))
            }
        }
        window.addEventListener('pointermove',mousemoveEvent)
        window.addEventListener('pointerup',mouseupEvent)
        return () => {
                window.removeEventListener('pointermove', mousemoveEvent)
                window.removeEventListener('pointerup', mouseupEvent)
                items.forEach(item => item.classList.remove('nearest'))
        }
        
    }, [dragState.isDown, modalRow])
    return (
    <>
        <div 
                className="overlay"
                onClick={()=>{
                    if(!dragState.isDown && !dragState.mouseup){
                        setIsOpen(false)
                        setModalRow([])
                    }
                    dragState.setMouseup(false)
                }}
            >
            <div className='row-wrapper'>
                <Row 
                    columns={modalRow}
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
                                    onPointerDown={(e)=>{
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
                        setScore(score.map((item,index)=>{
                            return (index === editingRow) ? modalRow : item
                        }))
                        setModalRow([])
                    }}
                >
                    submit this score
                </button>
        </div>
    </>
  )
    
}
export default Modal