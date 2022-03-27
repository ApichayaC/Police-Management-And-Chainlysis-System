import axios from "axios";
//import qs from "qs";

export default async function Line(data) {
    // res.statusCode = 200
    // try {
    //     const jsonData = {
    //         message: data ,
    //     }
    //     const request = await axios.post("https://notify-api.line.me/api/notify", {
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Authorization': `Bearer `+'xnCdNWTuFUPOxPZ2VtDjaNoouKrb0MP95h45mgvEQOi',
    //         },
    //         data: qs.stringify(jsonData),
    //     })
    //     console.log(request)
    // } catch (e) {
    //     console.log(e);
    // }
    // res.json({ status: 'OK' })
    const url = 'https://notify-api.line.me/api/notify'
    const jsonData = {
        message: data,
    }

    const requestOption = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ` + 'xnCdNWTuFUPOxPZ2VtDjaNoouKrb0MP95h45mgvEQOi',
        },
        data: JSON.stringify(jsonData),
        url,
    }

    axios(requestOption)
        .then((axiosRes) => {
            if (axiosRes.status === 200) {
                console.log('Notification Success')
                //res.status(201).end()
            }
        })
        .catch((error) => {
            //res.status(201).end()
            console.log(error)
        })

}