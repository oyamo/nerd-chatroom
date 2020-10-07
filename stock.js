/**
 *
 * @returns {number}
 * @param prices
 */
const predictStock = (prices)=>{
    if(
        typeof prices !== 'object' ||
        prices.length === 0
    ) return -1;
    /**
     *
     * @param stockValues
     * @returns {number}
     */
    const main = (stockValues) => {
        if(
            typeof prices !== 'object'
        ) return -1;
        // Find the minimum and max
        let min = [ stockValues[0] ,0 ];
        let max = [ stockValues[0], 0 ];
        for (let i = 0; i < stockValues.length; i++) {
            if(stockValues[i] < min[0]){
                min[0] = stockValues[i];
                min[1] = i;
            }
            if(stockValues[i] > max[0]){
                max[0] = stockValues[i];
                max[1] = i;
            }
        }
        if(max[1] < min[1] && stockValues.length > 2){
            const newArr = stockValues.filter( i => i !== max[0] )
            return main(newArr);
        }else if(max[1] < min[1] && stockValues.length === 2){
            return Infinity
        }
        else{
            return max[0];
        }
    }

    const predictedValue = main(prices);
    return prices.indexOf(predictedValue);
}

let testCases =[
    [200,1,5,6,7,34,10],
    [1,5,6,7,34,300],
    [10,1,5,6,7,34,10,20],
    [10,7],
    [1]
];

testCases.forEach(test=>{
    console.log(test);
    console.log(predictStock(test));
})