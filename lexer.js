const symbols = ["+", "-", "/", "*", ";", " ", "(", ")", "=", "{", "}"]

const findToken = (row , arr = []) => { 
    if(row.length > 0){
        if(![...row].some(e => e == ";")){
            arr.push("Error: expect \";\"")
            return arr
        }
        for(let i = 0; i < row.length; i++){
            if(row[i] == "\""){
                arr.push("\"")
                let str = ""
                i++
                while(row[i] != "\""){
                    str += row[i]
                    i++
                    console.log(str)
                }
                arr.push(str)
                arr.push("\"")
                return findToken(row.slice(+i+1), arr)
            }
            else{
                if(symbols.some(symbol => symbol == row[i])){
                    let newRow = [...row].join("")
                    arr.push(newRow.slice(0, i))
                    row[i] == " "?row[i]:arr.push(row[i])
                    return findToken(row.slice(+i+1), arr)
                }
            }
        }
    }
    else{
        return arr
    }
}

const lexer = e => {                                                
    let inputData = $('#input').val()
    let rows = inputData.split(/\n/)   
    $("textarea#output").val("")
    rows.map((row) => {
        let tokens = []
        findToken(row, tokens)
        $("textarea#output").val($("textarea#output").val()  + tokens.filter(e => e != "").join("\n")+ "\n")
        
    })
}