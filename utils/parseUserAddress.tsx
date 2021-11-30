export default function ParseAddress(currentAddress: string) {
    var NewAddress = currentAddress.slice(0, 5) + "...." + currentAddress.slice(37, 42);
    return (NewAddress)

}