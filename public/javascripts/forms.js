// Converts "on" and "off" checkbox values to Boolean
let checks = document.querySelectorAll('input[type=checkbox]');
for(let i = 0; i<checks.length; i++) {
    checks[i].addEventListener('change', function() {
        this.value = this.checked;
        console.log(this.checked);
    });
}

//Initialialization of pre-filled form data
for(let i = 0; i<checks.length; i++) {
    checks[i].value = checks[i].checked;
}