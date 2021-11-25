export function getFloorPrice(floor_value: number, ethPrice: number) {
    return ((floor_value * ethPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
}

export default getFloorPrice;