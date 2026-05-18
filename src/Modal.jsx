import Column from './Column'
import Row from './Row'
function Modal({IsOpen,setIsOpen,defaultColumn,columnInRow,selectedCell,setSelectedCell}) {
    const items = [...Array.from({length:22},(_,i)=>i),'x','h','p','|']
    const defaultRow = Array.from({length:columnInRow},(_,i)=>defaultColumn)
    return (
    <>
        {IsOpen && <div 
                className="overlay"
                onClick={()=>{
                    // if(素材クリックしてなければ){
                        setIsOpen(false)
                    // }
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
                                        console.log(item);
                                        setSelectedCell(item)
                                    }}
                                >
                                    {item}   
                                </div>
                    })
                }
                <div className='dragcell'>{selectedCell}</div>
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