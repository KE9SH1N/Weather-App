const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");


let api;

inputField.addEventListener("keyup", e=>{
    // inputfield value entered and value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
        // console.log("hlw")
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    }else{
        alert("Your browser not support geolocation api");
    }
});


function requestApi(city){
    // console.log(city);
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e4a570b7b10706e6c0a3b10e027361af`;
    fetchData();
}


function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=e4a570b7b10706e6c0a3b10e027361af`;
    fetchData();

    // console.log(position);
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    // getting api response and returning it with parsing into js obj and in another 
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}


function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    if(info.cod == 404){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{

        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;


        // using custom weather icon according to the id which api gives to us

        if(id == 800){
            wIcon.src = "Weather Icons/clear.svg";
        }
        else if(id >= 200 && id <= 232){
            wIcon.src = "Weather Icons/storm.svg";
        }
        else if(id >= 600 && id <= 622){
            wIcon.src = "Weather Icons/snow.svg";
        }
        else if(id >= 701 && id <= 781){
            wIcon.src ="Weather Icons/haze.svg";
        }
        else if(id >= 801 && id <= 804){
            wIcon.src = "Weather Icons/cloud.svg";
        }
        else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "Weather Icons/rain.svg";
        }

        // lets pass this value to perticular html elements

        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

        inputField.value = "";
        infoTxt.innerText = "";
        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        console.log(info);
    }
}


arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
});