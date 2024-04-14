// Define the API key
const apikey="b5f599f8c8e7a3f0acfe42937732d3b1";
// Execute when the window is fully loaded
document.addEventListener("DOMContentLoaded",()=>{
     // Check if geolocation is available
    if(navigator.geolocation){
        // Get the current position
        navigator.geolocation.getCurrentPosition((position)=>{
             // Extract latitude and longitude from the position
            let lon= position.coords.longitude;
            let lat= position.coords.latitude;
            // Construct the URL for fetching weather data based on the current location
            const url= `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` + `lon=${lon}&appid=${apikey}`;
           
            // Fetch weather data from the API
            fetch(url).then((res)=>{
                return res.json();
            }).then((data)=>{
                console.log(data); // Log the retrieved data
                console.log(new Date().getTime()); // Log the current timestamp
                const dat= new Date(data.dt) // Convert the timestamp from the data to local time
                console.log(dat.toLocaleString(undefined,'AFRICA/NAIROBI'));
                console.log(new Date().getMinutes()); // Log the current minute
                weatherReport(data);
            });
        });
    }
});

// Function to fetch weather data by city name
function searchByCity() {
    // Get the city name from the input field
    const place= document.getElementById('input').value;
    // Construct the URL for fetching weather data based on the city name
    const urlsearch= `http://api.openweathermap.org/data/2.5/weather?q=${place}&` + `appid=${apikey}`;

     // Fetch weather data from the API
    fetch(urlsearch).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data);
        weatherReport(data);
    })
    // Clear the input field after searching
    document.getElementById('input').value='';
};

// Function to process and display weather report
function weatherReport(data){
 // Construct the URL for fetching weather forecast data based on the city name
    const urlcast= `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&` + `appid=${apikey}`;

    // Fetch weather forecast data from the API
    fetch(urlcast).then((res)=>{
        return res.json();
    }).then((forecast)=>{
        console.log(forecast.city);
        hourForecast(forecast);
        dayForecast(forecast);

        console.log(data); // Display city name and country code
        document.getElementById('city').innerText= data.name + ', '+data.sys.country;
        console.log(data.name,data.sys.country);
    
         // Display temperature
        console.log(Math.floor(data.main.temp-273));
        document.getElementById('temperature').innerText= Math.floor(data.main.temp-273)+ ' °C';
    
         // Display weather description
        document.getElementById('clouds').innerText= data.weather[0].description;
        console.log(data.weather[0].description);
        
        // Display weather icon
        let icon1= data.weather[0].icon;
        let iconurl= "http://api.openweathermap.org/img/w/"+ icon1 +".png";
        document.getElementById('img').src=iconurl;
    });

};

// Function to display hourly forecast
function hourForecast(forecast){
    document.querySelector('.templist').innerHTML='';
    for (let i = 0; i < 5; i++) {

        const date= new Date(forecast.list[i].dt*1000);
        console.log((date.toLocaleTimeString(undefined,'AFRICA/NAIROBI')).replace(':00',''));

        let hourR=document.createElement('div');
        hourR.setAttribute('class','next');

        let div= document.createElement('div');
        let time= document.createElement('p');
        time.setAttribute('class','time');
        time.innerText= (date.toLocaleTimeString(undefined,'AFRICA/NAIROBI')).replace(':00','');

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';

        div.appendChild(time);
        div.appendChild(temp);

        let desc= document.createElement('p');
        desc.setAttribute('class','desc');
        desc.innerText= forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
}
};

// Function to display daily forecast
function dayForecast(forecast){
    document.querySelector('.weekF').innerHTML=''
    for (let i = 8; i < forecast.list.length; i+=8) {
        console.log(forecast.list[i]);
        let div= document.createElement('div');
        div.setAttribute('class','dayF');
        
        let day= document.createElement('p');
        day.setAttribute('class','date');
        day.innerText= new Date(forecast.list[i].dt*1000).toDateString(undefined,'AFRICA/NAIROBI');
        div.appendChild(day);

        let temp= document.createElement('p');
        temp.innerText= Math.floor((forecast.list[i].main.temp_max - 273))+ ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273))+ ' °C';
        div.appendChild(temp);

        let description= document.createElement('p');
        description.setAttribute('class','desc');
        description.innerText= forecast.list[i].weather[0].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    }
} 