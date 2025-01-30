export const formatPrice = (price:number) => {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        currencyDisplay: "narrowSymbol",        
    }).format(price)
}