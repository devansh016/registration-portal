base_url = "https://tiedc.herokuapp.com";

function register(){
    var data = JSON.stringify({
        "name": document.getElementById("name").value,
        "phone": document.getElementById("phone").value,
        "email": document.getElementById("email").value,
        "college": document.getElementById("college").value,
        "address":{
            "address1": document.getElementById("address1").value,
            "address2": document.getElementById("address2").value,
            "city": document.getElementById("city").value,
            "pincode": document.getElementById("pincode").value,
            "state": document.getElementById("state").value
        }
    });

    var config = {
        method: 'post',
        url: base_url + '/orders',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            if(response.data.StatusCode == "201"){
                alert(response.data.message);
                return;
            }
            var options = {
                "key": response.data.razorpay_key_id,
                "amount": response.data.amount,
                "currency": response.data.currency,
                "name": "TIEDC",
                "description": "E-Summit Registration",
                "image": base_url + '/logo-white.png',
                "order_id": response.data.order_id, 
                "callback_url": base_url + '/paymentCapture',
                "prefill": {
                    "name": response.data.name,
                    "email": response.data.email,
                    "contact": "+91" + response.data.phone
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            console.log(options)
            var rzp1 = new Razorpay(options);
            rzp1.open();
            e.preventDefault();
        })
        .catch(function (error) {
            console.log(error);
        });
}