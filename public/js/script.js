// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()



  
   async function map(location) { 
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=geojson`; 
    try {
        let res = await fetch(url);
        let data = await res.json();
        
        // Check if data.features is not empty
        if (data.features.length > 0) {
            const lat1 = data.features[0].geometry.coordinates[1];
            const long1 = data.features[0].geometry.coordinates[0];
            map = new mappls.Map('map', { center: { lat: lat1, lng: long1 } });
            var marker = new mappls.Marker({
                map: map,
                position: { "lat": lat1, "lng": long1 }
            });

        
        } else {
            console.log("No location data found.");
            map = new mappls.Map('map', { center: { lat: 0, lng: 0 } });
        }
    } catch (err) {
        map = new mappls.Map('map', { center: { lat: 0, lng: 0 } });
        console.log(err);
    }
} 

