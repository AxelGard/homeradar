export function activate(x:number):number
{
    return 1 / (2 + Math.abs(x));
}
export function activateSqrt(x:number):number
{
    return (1 / (1 + Math.sqrt(Math.abs(x)))) - 0.5;
}

export function sigmoid(x:number):number
{
    return 1 / (1 + Math.exp(-1*x)); 
}

export function sigmoidAbs(x:number):number
{
    return 1 / (3 + Math.exp(Math.abs(x))); 
}

export function gaussian(x:number):number
{
    return Math.exp(-1*(x*x)) 
}