export function create_board (chess_letter, chess_number) {

    for (let i = 7; i >= 0; i--) {

        chess_board += `<div class="cb-row">`;
        
        if(i%2==0){
            for (let j = 0; j < 8; j++) {
    
                let id = chess_number[i]+chess_letter[j];
            
                chess_board += `
                <div class="cb-cell first-color" id="${id}">
                    <div class="letter">${id}</div>
                </div>`;
                
            }
        }else {
            for (let j = 0; j < 8; j++) {
            
                let id = chess_number[i]+chess_letter[j];
            
                chess_board += `
                <div class="cb-cell second-color" id="${id}">
                    <div class="letter">${id}</div>
                </div>`;
                
            }
        }
    
        chess_board += `</div>`;
        
    }

    return chess_board;

}
