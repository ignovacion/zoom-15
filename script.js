document.addEventListener("DOMContentLoaded", function () {
    const schedule = document.getElementById("schedule");
    const companySelect = document.getElementById("company");
    const calendar = document.getElementById("calendar");
    const dateInput = document.getElementById("date-input");
    
    function formatDate(date) {
        return date.toISOString().split("T")[0];
    }

    function loadReservations() {
        schedule.innerHTML = "";
        calendar.innerHTML = "";
        const reservations = JSON.parse(localStorage.getItem("reservations")) || {};
        const formattedDate = dateInput.value;

        if (!reservations[formattedDate]) reservations[formattedDate] = {};

        const hours = [];
        for (let i = 8; i < 22; i++) {
            hours.push(`${i}:00 - ${i + 1}:00`);
        }

        hours.forEach(hour => {
            let totalCount = 0;
            let reservationDetails = "";

            Object.keys(reservations[formattedDate]).forEach(company => {
                if (reservations[formattedDate][company] && reservations[formattedDate][company][hour]) {
                    totalCount += reservations[formattedDate][company][hour].length;
                    reservations[formattedDate][company][hour].forEach(name => {
                        reservationDetails += `<div class='event'><strong>${hour}</strong>: ${name} (${company})</div>`;
                    });
                }
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${hour}</td>
                <td>
                    <button onclick="reserve('${hour}')">Reservar</button>
                    <span>${totalCount} sesiones</span>
                </td>
            `;
            if (totalCount >= 2) {
                row.classList.add("red-alert");
            }
            schedule.appendChild(row);
            calendar.innerHTML += reservationDetails;
        });
    }

    window.reserve = function (hour) {
        const name = prompt("Ingrese su nombre para la reserva:");
        if (!name) return;

        const company = companySelect.value;
        const formattedDate = dateInput.value;
        let reservations = JSON.parse(localStorage.getItem("reservations")) || {};
        if (!reservations[formattedDate]) reservations[formattedDate] = {};
        if (!reservations[formattedDate][company]) reservations[formattedDate][company] = {};
        if (!reservations[formattedDate][company][hour]) reservations[formattedDate][company][hour] = [];

        reservations[formattedDate][company][hour].push(name);
        localStorage.setItem("reservations", JSON.stringify(reservations));
        loadReservations();
    };

    dateInput.addEventListener("change", loadReservations);
    companySelect.addEventListener("change", loadReservations);
    dateInput.value = formatDate(new Date());
    loadReservations();
});
