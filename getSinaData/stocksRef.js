class StockRef {
    constructor() {
        this.ref = {}
        this.us = new Set()
        this.sh = new Set()
        this.sz = new Set()
        this.hk = new Set()
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
            if (symbol.substr(0, 3) == "gb_") this.us.add(symbol)
            else this[symbol.substr(0, 2)].add(symbol)
            return true
        }
    }
    removeSymbol(symbol) {
        if (this.ref.hasOwnProperty(symbol)) {
            if (--this.ref[symbol] == 0) {
                delete this.ref[symbol]
                if (symbol.substr(0, 3) == "gb_") this.us.delete(symbol)
                else this[symbol.substr(0, 2)].delete(symbol)
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