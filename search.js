// assets/js/booking.js
document.addEventListener('DOMContentLoaded', () => {
  let selectedSeats = [];
  let currentSeatPrice = 0;

  // ===== ROUTE & BUS DATA =====
  const busData = {
    "Nairobi-Mombasa": {
      price: 1200,
      buses: [
        { id: "Scania", name: "Luxury Express", reservedSeats: ["1A", "1B", "2A"] },
        { id: "Vantool", name: "Coast Rider", reservedSeats: ["3A", "3B", "4C"] }
      ]
    },
    "Nairobi-Kisumu": {
      price: 950,
      buses: [
        { id: "Concord", name: "Lake View", reservedSeats: ["1C", "2D", "3A"] },
        { id: "Man", name: "Western Star", reservedSeats: ["2B", "3C"] }
      ]
    },
    "Mombasa-Nairobi": {
      price: 1200,
      buses: [
        { id: "Mercedes", name: "Coastal Express", reservedSeats: ["1A", "1B", "4D"] }
      ]
    },
    "Nairobi-Eldoret": {
      price: 700,
      buses: [
        { id: "Mood", name: "Highland Rider", reservedSeats: ["2A", "2B"] }
      ]
    },
    "Nairobi-Nakuru": {
      price: 500,
      buses: [
        { id: "Merlin", name: "Rift Shuttle", reservedSeats: ["1D", "3B"] }
      ]
    }
  };

  // ===== DOM ELEMENTS =====
  const departureSelect = document.getElementById('departure');
  const destinationSelect = document.getElementById('destination');
  const busSelect = document.getElementById('bus');
  const seatContainer = document.getElementById('seat-container');

  const summaryRoute = document.getElementById('summary-route');
  const summaryBus = document.getElementById('summary-bus');
  const selectedSeatsEl = document.getElementById('selected-seats');
  const totalPriceEl = document.getElementById('total-price');

  const bookingForm = document.getElementById('booking-form');

  const ROWS = 5;
  const COLS = 4;

  // ===== HELPER FUNCTIONS =====
  function getRouteKey(dep, dest) {
    return `${dep}-${dest}`;
  }

  function findRouteData(dep, dest) {
    const key = getRouteKey(dep, dest);
    return busData[key] || busData[`${dest}-${dep}`] || null;
  }

  function clearSeats() {
    seatContainer.innerHTML = '';
    selectedSeats = [];
    updateSummary();
  }

  function generateSeats(reservedSeats = []) {
    seatContainer.innerHTML = '';
    for (let r = 1; r <= ROWS; r++) {
      for (let c = 1; c <= COLS; c++) {
        const seatId = `${r}${String.fromCharCode(64 + c)}`;
        const seat = document.createElement('button');
        seat.type = 'button';
        seat.className = 'seat';
        seat.innerText = seatId;
        seat.dataset.seat = seatId;

        if (reservedSeats.includes(seatId)) {
          seat.classList.add('reserved');
          seat.disabled = true;
        } else {
          seat.addEventListener('click', () => toggleSeat(seatId, seat));
        }

        seatContainer.appendChild(seat);
      }
    }
  }

  function toggleSeat(seatId, seatElement) {
    if (selectedSeats.includes(seatId)) {
      selectedSeats = selectedSeats.filter(s => s !== seatId);
      seatElement.classList.remove('selected');
    } else {
      selectedSeats.push(seatId);
      seatElement.classList.add('selected');
    }
    updateSummary();
  }

  function updateSummary() {
    const dep = departureSelect.value || '-';
    const dest = destinationSelect.value || '-';
    const busName = busSelect.selectedOptions.length ? busSelect.selectedOptions[0].text : '-';

    summaryRoute.innerText = dep === '-' && dest === '-' ? 'Not selected' : `${dep} → ${dest}`;
    summaryBus.innerText = busName;
    selectedSeatsEl.innerText = selectedSeats.length ? selectedSeats.join(', ') : 'None';
    totalPriceEl.innerText = `KES ${selectedSeats.length * currentSeatPrice}`;
  }

  function loadAvailableBuses() {
    const dep = departureSelect.value;
    const dest = destinationSelect.value;

    busSelect.innerHTML = '<option value="">Select bus</option>';
    clearSeats();

    if (!dep || !dest || dep === dest) return;

    const routeInfo = findRouteData(dep, dest);

    // ===== DEBUGGING =====
    console.log("Route info for", dep, "→", dest, ":", routeInfo);

    if (!routeInfo) {
      busSelect.innerHTML = '<option value="">No buses available</option>';
      currentSeatPrice = 0;
      updateSummary();
      return;
    }

    currentSeatPrice = routeInfo.price;

    routeInfo.buses.forEach(bus => {
      const opt = document.createElement('option');
      opt.value = bus.id;
      opt.text = `${bus.name} (${bus.id})`;
      busSelect.appendChild(opt);
    });

    updateSummary();
  }

  function loadSeatsForSelectedBus() {
    const dep = departureSelect.value;
    const dest = destinationSelect.value;
    const selectedBusId = busSelect.value;

    clearSeats();
    if (!dep || !dest || !selectedBusId) return;

    const routeInfo = findRouteData(dep, dest);
    if (!routeInfo) return;

    const bus = routeInfo.buses.find(b => b.id === selectedBusId);
    if (!bus) return;

    generateSeats(bus.reservedSeats);
    updateSummary();
  }

  function confirmBooking(e) {
    e.preventDefault();

    const dep = departureSelect.value;
    const dest = destinationSelect.value;
    const busId = busSelect.value;

    if (!dep || !dest) { alert('Please choose departure and destination.'); return; }
    if (!busId) { alert('Please select a bus.'); return; }
    if (selectedSeats.length === 0) { alert('Please select at least one seat.'); return; }

    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const payment = document.getElementById('payment-method').value;

    if (!fullName || !email || !phone || !payment) {
      alert('Please complete passenger details and payment information.');
      return;
    }

    const routeInfo = findRouteData(dep, dest);
    const bus = routeInfo.buses.find(b => b.id === busId);

    // Update reserved seats
    bus.reservedSeats = [...new Set([...bus.reservedSeats, ...selectedSeats])];

    const totalCost = selectedSeats.length * currentSeatPrice;
    const bookingRef = `BB${Math.floor(Math.random() * 1000000)}`;

    alert(`
Booking Confirmed!
Reference: ${bookingRef}
Passenger: ${fullName}
Route: ${dep} → ${dest}
Bus: ${bus.name}
Seats: ${selectedSeats.join(', ')}
Total: KES ${totalCost}
    `);

    bookingForm.reset();
    selectedSeats = [];
    clearSeats();
    updateSummary();
  }

  // ===== EVENT LISTENERS =====
  departureSelect.addEventListener('change', loadAvailableBuses);
  destinationSelect.addEventListener('change', loadAvailableBuses);
  busSelect.addEventListener('change', loadSeatsForSelectedBus);
  bookingForm.addEventListener('submit', confirmBooking);

  // Prevent selecting past dates
  const dateInput = document.getElementById('travel-date');
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
});
