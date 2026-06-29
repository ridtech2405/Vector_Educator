/* =====================================
   STUDENT ATTENDANCE DASHBOARD
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const attendanceRadios = document.querySelectorAll(".attendance");

    const presentCount = document.getElementById("presentCount");
    const absentCount = document.getElementById("absentCount");
    const leaveCount = document.getElementById("leaveCount");

    const presentTotal = document.getElementById("presentTotal");
    const absentTotal = document.getElementById("absentTotal");
    const leaveTotal = document.getElementById("leaveTotal");

    const totalStudents = document.getElementById("totalStudents");

    const searchInput = document.getElementById("searchInput");

    const resetBtn = document.getElementById("resetAttendance");

    const saveBtn = document.getElementById("saveAttendance");

    const attendanceDate = document.getElementById("attendanceDate");

    /* ===============================
       Today's Date
    =============================== */

    const today = new Date().toISOString().split("T")[0];

    attendanceDate.value = today;

    /* ===============================
       Update Attendance Counter
    =============================== */

    function updateAttendance() {

        let present = 0;
        let absent = 0;
        let leave = 0;

        document.querySelectorAll("tbody tr").forEach(row => {

            const checked = row.querySelector("input[type='radio']:checked");

            if (!checked) return;

            switch (checked.value) {

                case "Present":
                    present++;
                    break;

                case "Absent":
                    absent++;
                    break;

                case "Leave":
                    leave++;
                    break;
            }

        });

        presentCount.innerText = present;
        absentCount.innerText = absent;
        leaveCount.innerText = leave;

        presentTotal.innerText = present;
        absentTotal.innerText = absent;
        leaveTotal.innerText = leave;

        totalStudents.innerText =
            document.querySelectorAll("tbody tr").length;

    }

    attendanceRadios.forEach(radio => {

        radio.addEventListener("change", updateAttendance);

    });

    updateAttendance();

    /* ===============================
       Search Student
    =============================== */

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("#studentTable tr").forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display =
                text.includes(value) ? "" : "none";

        });

    });

    /* ===============================
       Reset Attendance
    =============================== */

    resetBtn.addEventListener("click", function () {

        if (!confirm("Reset today's attendance?")) return;

        document.querySelectorAll(".present-radio").forEach(radio => {

            radio.checked = true;

        });

        updateAttendance();

    });

    /* ===============================
       Save Attendance
    =============================== */

    saveBtn.addEventListener("click", function () {

        const attendanceData = [];

        document.querySelectorAll("#studentTable tr").forEach(row => {

            const roll =
                row.cells[1].innerText;

            const name =
                row.cells[2].innerText;

            const status =
                row.querySelector("input[type='radio']:checked").value;

            attendanceData.push({

                roll,

                name,

                status

            });

        });

        console.log(attendanceData);

        alert("✅ Attendance Saved Successfully!");

    });

});