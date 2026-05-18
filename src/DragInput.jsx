function DragInput({item,e,setIsDown}){
    const rect = e.getBoundingClientRect()
    const xy = [e.clientX,e.clientY]
    const mouseDown = () => {
        setIsDown(true)
        startPoint = [e.clientX - modalRect.left - rect.width / 2,e.clientY - modalRect.top- rect.height / 2]
    }
    const mouseMove = () => {
        setIsDown(true)
    }
}