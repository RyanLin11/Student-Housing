// Converts "on" and "off" checkbox values to Boolean
let checks = document.querySelectorAll('input[type=checkbox]');
for(let i = 0; i<checks.length; i++) {
    checks[i].addEventListener('change', function() {
        this.value = this.checked;
    });
}

// Converts Boolean to Checkbox values on intiial load
for(let i = 0; i<checks.length; i++) {
    if(checks[i].value === true) {
        checks[i].checked = true;
    } else if(checks[i].value === false) {
        checks[i].checked = false;
    }
}