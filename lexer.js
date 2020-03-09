const symbols = ["+", "-", "/", "*", ";", " ", "(", ")", "=", "{", "}"]

const tokensTypes = {
    "operation" : ["+", "-", "*", "/", "="],
    "keyword" : ["var", "const"],
    "function" : ["out"],
    "endpoint" : [";"],
    "quote" : ["\"", "(", ")"],
}

let variables = []

const findToken = (row , arr = []) => { 
    if(row.length > 0){
        if(![...row].some(e => e == ";")){
            arr.push("Error: expect \";\"")
            return arr
        }
        for(let i = 0; i < row.length; i++){
            if(row[i] == "\""){
                let str = ""
                i++
                while(row[i] != "\""){
                    str += row[i]
                    i++
                }
                arr.push(`"${str}"`)
                return findToken(row.slice(+i+1), arr)
            }
            else if(row[i] == "/" && row[i+1] == "/"){
                return arr
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

const runRow = tokens => {
    if(Object.keys(tokens[0]) == "keyword")
        return createVariable(tokens)
    if(Object.keys(tokens[0]) == "variable")
        return changeVariable(tokens)
    return "no keywords"
}  

const createVariable = tokens => {
    let value
    if(Object.values(tokens[2]) == ";"){
       value = undefined
    }
    else{
        if(Object.values(tokens[2])  == "="){
            let [keyword, variable, equal, ...expression] = tokens
            expression.pop()
            value = calcExpression(expression)
        }
        else{
            return "Error"
        }
    }
    variables.push({
        [Object.values(tokens[1])]: value
    })
    return value
}

const changeVariable = tokens => {
    let foundVariableIndex = variables.findIndex(variable => 
        Object.values(tokens[0])[0] == Object.keys(variable)[0]
    )
    let value
    if(!foundVariableIndex){
       return "Error"
    }
    else{
        if(Object.values(tokens[1])  == "="){
            let [variable, equal, ...expression] = tokens
            expression.pop()
            value = calcExpression(expression)
        }
        else{
            return "Error"
        }
    }
    variables[foundVariableIndex][Object.values(tokens[0])[0]] = value
    return value
}

// Need to fix Undefined variables
// Row 90

const calcExpression = elements => {
    if(elements.length == 1)
        return Number.isInteger(+Object.values(elements[0])[0])?+Object.values(elements[0])[0]:Object.values(elements[0])[0]
    return math.evaluate(Object.values(elements).map(e => {
        if(Object.keys(e)[0] == "variable"){
            let foundVariableIndex = variables.findIndex(variable => 
                Object.values(e)[0] == Object.keys(variable)[0]
            )
            if(foundVariableIndex != -1)    
                return Object.values(variables[foundVariableIndex])[0]
            else
                return "Variable not Found"
        }
        else{
            return Object.values(e)[0]
        }
    }).join(""))
}

const lexer = e => {                                                
    let inputData = $('#input').val()
    let rows = inputData.split(/\n/)   
    $("textarea#output").val("")
    rows.map((row) => {
        let tokens = []
        findToken(row, tokens)
        tokens = tokens.filter(e => e != "")
        tokens = tokens.map((token, index) => {
            let key = Object.keys(tokensTypes).find(key => tokensTypes[key].some(tokenFound => tokenFound == token))
            if(key)
                return {[key]: token}
            if(Number(token))
                return {"number": token}
            return {"variable": token}
        })
        tokens.map(token => {
            $("textarea#output").val($("textarea#output").val()  + Object.keys(token) + " : " + Object.values(token) + "\n")
        })
        console.log(runRow(tokens))
        console.log(variables)
    })
}