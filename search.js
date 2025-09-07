document.addEventListener('DOMContentLoaded', () => {
  let selectedSeats = [];
  let currentSeatPrice = 0;

  const busData = {
    "Nairobi-Mombasa": {
      price: 1200,
      buses: [
        { id: "Scania", name: "Luxury Express", reservedSeats: ["1A","1B","2A"] },
        { id: "Vantool", name: "Coast Rider", reservedSeats: ["3A","3B","4C"] }
      ]
    },
    "Nairobi-Kisumu": {
      price: 950,
      buses: [
        { id: "Concord", name: "Lake View", reservedSeats: ["1C","2D","3A"] },
        { id: "Man", name: "Western Star", reservedSeats: ["2B","3C"] }
      ]
    },
    "Mombasa-Nairobi": {
      price: 1200,
      buses: [
        { id: "Mercedes", name: "Coastal Express", reservedSeats: ["1A","1B","4D"] }
      ]
    },
    "Nairobi-Eldoret": {
      price: 700,
      buses: [
        { id: "Mood", name: "Highland Rider", reservedSeats: ["2A","2B"] }
      ]
    },
    "Nairobi-Nakuru": {
      price: 500,
      buses: [
        { id: "Merlin", name: "Rift Shuttle", reservedSeats: ["1D","3B"] }
      ]
    }
  };

  const departureSelect = document.getElementById('departure');
  const destinationSelect = document.getElementById('destination');
  const busSelect = document.getElementById('bus');
  const seatContainer = document.getElementById('seat-container');
  const summaryRoute = document.getElementById('summary-route');
  const summaryBus = document.getElementById('summary-bus');
  const selectedSeatsEl = document.getElementById('selected-seats');
  const totalPriceEl = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');

  function findRoute(dep,dest){
    let key = dep+'-'+dest;
    return busData[key] || busData[dest+'-'+dep] || null;
  }

  function updateSummary(){
    const dep = departureSelect.value || '-';
    const dest = destinationSelect.value || '-';
    const busName = busSelect.selectedOptions.length ? busSelect.selectedOptions[0].text : '-';
    summaryRoute.innerText = dep === '-' && dest === '-' ? 'Not selected' : `${dep} → ${dest}`;
    summaryBus.innerText = busName;
    selectedSeatsEl.innerText = selectedSeats.length ? selectedSeats.join(', ') : 'None';
    totalPriceEl.innerText = `KES ${selectedSeats.length * currentSeatPrice}`;
  }

  function clearSeats(){ seatContainer.innerHTML=''; selectedSeats=[]; updateSummary(); }

  function generateSeats(reserved=[]){
    seatContainer.innerHTML='';
    for(let r=1;r<=5;r++){
      for(let c=1;c<=4;c++){
        const id=r+String.fromCharCode(64+c);
        const btn=document.createElement('button');
        btn.type='button';
        btn.innerText=id;
        btn.className='seat';
        if(reserved.includes(id)){ btn.classList.add('reserved'); btn.disabled=true; }
        else{ btn.addEventListener('click',()=>{ 
          if(selectedSeats.includes(id)){ selectedSeats=selectedSeats.filter(s=>s!==id); btn.classList.remove('selected'); }
          else{ selectedSeats.push(id); btn.classList.add('selected'); }
          updateSummary();
        }); }
        seatContainer.appendChild(btn);
      }
    }
  }

  function loadBuses(){
    const dep=departureSelect.value;
    const dest=destinationSelect.value;
    busSelect.innerHTML='<option value="">Select bus</option>';
    clearSeats();
    if(!dep || !dest || dep===dest) return;
    const route=findRoute(dep,dest);
    if(!route){ busSelect.innerHTML='<option value="">No buses available</option>'; currentSeatPrice=0; updateSummary(); return; }
    currentSeatPrice=route.price;
    route.buses.forEach(bus=>{
      const opt=document.createElement('option');
      opt.value=bus.id; opt.text=`${bus.name} (${bus.id})`;
      busSelect.appendChild(opt);
    });
    updateSummary();
  }

  function loadSeatsForBus(){
    const dep=departureSelect.value;
    const dest=destinationSelect.value;
    const busId=busSelect.value;
    clearSeats();
    if(!dep||!dest||!busId) return;
    const route=findRoute(dep,dest);
    if(!route) return;
    const bus=route.buses.find(b=>b.id===busId);
    if(!bus) return;
    generateSeats(bus.reservedSeats);
    updateSummary();
  }

  function confirmBooking(e){
    e.preventDefault();
    const dep=departureSelect.value;
    const dest=destinationSelect.value;
    const busId=busSelect.value;
    if(!dep||!dest){ alert('Select departure and destination'); return; }
    if(!busId){ alert('Select a bus'); return; }
    if(selectedSeats.length===0){ alert('Select at least one seat'); return; }
    const name=document.getElementById('full-name').value.trim();
    const email=document.getElementById('email').value.trim();
    const phone=document.getElementById('phone').value.trim();
    const payment=document.getElementById('payment-method').value;
    if(!name||!email||!phone||!payment){ alert('Complete passenger and payment info'); return; }
    const route=findRoute(dep,dest);
    const bus=route.buses.find(b=>b.id===busId);
    bus.reservedSeats=[...new Set([...bus.reservedSeats,...selectedSeats])];
    const total=selectedSeats.length*currentSeatPrice;
    const ref='BB'+Math.floor(Math.random()*1000000);
    alert(`Booking Confirmed!\nReference: ${ref}\nPassenger: ${name}\nRoute: ${dep} → ${dest}\nBus: ${bus.name}\nSeats: ${selectedSeats.join(', ')}\nTotal: KES ${total}`);
    bookingForm.reset(); selectedSeats=[]; clearSeats(); updateSummary();
  }

  departureSelect.addEventListener('change', loadBuses);
  destinationSelect.addEventListener('change', loadBuses);
  busSelect.addEventListener('change', loadSeatsForBus);
  bookingForm.addEventListener('submit', confirmBooking);

  // Prevent past dates
  const dateInput = document.getElementById('travel-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
});
