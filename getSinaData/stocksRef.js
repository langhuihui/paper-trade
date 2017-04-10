class StockRef {
    constructor() {
        this.ref = {}
    }
    get array() {
        return Object.keys(this.ref)
    }
    addSymbol(symbol) {
        if (this.ref.hasOwnProperty(symbol)) {
            this.ref[symbol]++;
            return false
        } else {
            this.ref[symbol] = 1
            return true
        }
    }
    removeSymbol(symbol) {
        if (this.ref.hasOwnProperty(symbol)) {
            if (--this.ref[symbol] == 0) {
                delete this.ref[symbo]
                return true
            }
        }
    }
    removeSymbols(symbols) {
        for (let symbol of symbols) {
            this.removeSymbol(symbol)
        }
    }

    addSymbols(symbols) {
        for (let symbol of symbols) {
            this.addSymbol(symbol)
        }
    }
    clear() {
        this.ref = {}
    }
}
export default StockRef