//Function added for correct timezone support
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
//Set the value of the date picker input to the current date
document.getElementById('date-picker').value = new Date().toDateInputValue();
document.getElementById('results-container').className = 'results-container hide';