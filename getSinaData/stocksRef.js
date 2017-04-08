class StockRef {
    constructor() {
        this.ref = new Map()
    }
    get array() {
        return Array.from(this.ref.keys())
    }
    addSymbol(symbol) {
        if (this.ref.has(symbol)) {
            this.ref.set(symbol, this.ref.get(symbol) + 1)
            return false
        } else {
            this.ref.set(symbol, 1)
            return true
        }
    }
    removeSymbol(symbol) {
        if (this.ref.has(symbol)) {
            let oldValue = this.ref.get(symbol)
            this.ref.set(symbol, oldValue - 1)
            if (oldValue == 1) {
                this.ref.delete(symbol)
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
        this.ref.clear()
    }
}
export default StockRef