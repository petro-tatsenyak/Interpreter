const lexer = e => {     
       
    const symbols = ["+", "-", "/", "*", ";", " ", "(", ")", "=", "{", "}"]

    const tokensTypes = {
        "operation" : ["+", "-", "*", "/", "="],
        "keyword" : ["var", "const"],
        "function" : ["out"],
        "endpoint" : [";", "{", "}"],
        "quote" : ["\"", "(", ")"],
        "condition": ["if"],
        "loop" : ["while"]
    }

    let variables = []

    let cond = true 

    let loopTokenCreate = false

    let lastCheck = true

    let loopActive = false

    let loopTokens = []

    let openCounter = 0 

    let closeCounter = 0 

    const findToken = (row , arr = []) => { 
        if(row.length > 0){
            if(![...row].some(e => e == ";" || e == "{" || e == "}" || e == ")")){
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
        if(Object.values(tokens[0])[0] == "}")
            closeCounter++
        if(Object.values(tokens[0])[0] == "{")
            openCounter++
        if(loopTokenCreate){
            if(openCounter - closeCounter != 0){
                loopTokens.push(tokens)
                return loopTokens
            }
            loopTokens.push(tokens)
            loopTokenCreate = false
        }

        if(cond){
            if(Object.keys(tokens[0]) == "keyword")
                return createVariable(tokens)
            if(Object.keys(tokens[0]) == "variable")
                return changeVariable(tokens)
            if(Object.keys(tokens[0]) == "function")
                return runFunction(tokens)
            if(Object.keys(tokens[0]) == "condition"){
                cond = checkConditon(tokens)
                return cond
            }
            if(Object.keys(tokens[0]) == "loop"){
                loopActive = checkConditon(tokens)
                lastCheck = tokens
                loopTokenCreate = true
                return loopActive
            }
            if(loopActive){
                if(openCounter - closeCounter == 0){   
                    while(loopActive){
                        loopTokenCreate = false
                        loopActive = checkConditon(lastCheck)
                        if(loopActive){
                            loopTokens.map(loopElem =>  runRow(loopElem))
                        }
                    }
                        loopActive = false
                }
            }

        }
        else{
            if(openCounter - closeCounter == 0)    
                cond = true
        }
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
                if(expression.length == 1){
                    value = Number.isInteger(+Object.values(expression[0])[0])?+Object.values(expression[0])[0]:
                    Object.values(expression[0])[0]
                }
                else{
                    value = calcExpression(expression)
                }  
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
        if(foundVariableIndex < 0){
        return "Error"
        }
        else{
            if(Object.values(tokens[1])[0]  == "="){
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

    const checkConditon = tokens => {
        let [key, open,...conditions] = tokens
        conditions.pop()
        let foundVariableIndex = variables.findIndex(variable => 
            Object.values(conditions).map(e => Object.values(e)[0]).some(e => e == Object.keys(variable)[0])
        )
        return eval(Object.values(conditions).map(e => {
            if(Object.values(e)[0] ==  Object.keys(Object.values(variables)[foundVariableIndex])[0]){
                return `${Object.values(Object.values(variables)[foundVariableIndex])[0]}`
            }    
            return Object.values(e)[0]
        }).join(""))
    }

    const runFunction = tokens => {
        if(Object.values(tokens[0])[0] == "out"){
            let [name, open, param, close] = tokens
            return out(param)
        }
        
    }

    const out = param => {
        let outText = "" 
        let foundVariableIndex = variables.findIndex(variable => 
            Object.values(param)[0] == Object.keys(variable)[0]
        )
        if(foundVariableIndex > -1){
            outText += Object.values(variables[foundVariableIndex])[0] 
        }
        else{
            if(Object.values(param)[0] == "\\")
                outText += "\n"
            else
                outText += Object.values(param)[0]
        }
        outText = [...outText].filter(e => e != "\"").join("")
        $("textarea#output").val($("textarea#output").val() + outText)
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
        runRow(tokens)
        //console.log(variables)
    })
}