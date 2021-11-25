export async function GetNftInfo(url: string, setDataPrice: any) {
    try {
        fetch(url)
            .then(res => res.json())
            .then(rawdata => {

                var price_data = [];

                for (var i = 1; i < 10000; i++) {
                    var number = i.toString();

                    if (rawdata.prices[number]) {

                        var data_id = number;
                        var data_price = rawdata.prices[number][1];

                        var new_object = {
                            id: data_id,
                            price: data_price
                        };

                        price_data.push(new_object);
                    }
                }
                setDataPrice(price_data);
                setDataPrice([...price_data].sort((b, a) => b.price - a.price));
            });
    } catch (err) {
        console.log(err);
    };
}

export default GetNftInfo;