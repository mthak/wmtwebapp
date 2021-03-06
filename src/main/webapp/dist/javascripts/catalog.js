// data array for filling in info box
var catalogListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the  table on initial page load
    populateTable();

// ProductId link click
    $('#CatalogList table tbody').on('click', 'td a.linkproduct', showCatalogInfo);
// Add Catalog button click
    $('#btnAddCatalog').on('click', addnewCatalog);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/catalog/cataloglist', function( data ) {
        catalogListData = data; 
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkproduct" rel="' + this.ProductId + '" title="Show Details">' + this.ProductId + '</a></td>';
            tableContent += '<td>' + this.Category + '</td>';
            tableContent += '<td>' + this.Brand + '</td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#CatalogList table tbody').html(tableContent);
    });
};

// Show Catalog Info
function showCatalogInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve data  from link rel attribute
    var thisCatalog = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = catalogListData.map(function(arrayItem) { return arrayItem.ProductId; }).indexOf(thisCatalog);

 // Get our User Object
    var thisCatalogObject = catalogListData[arrayPosition];

    //Populate Info Box
    $('#CatalogInfoProduct').text(thisCatalogObject.ProductId);
    $('#CatalogInfoCategory').text(thisCatalogObject.Category);
    $('#CatalogInfoBrand').text(thisCatalogObject.Brand);
    $('#CatalogInfoModel').text(thisCatalogObject.Model);
    $('#CatalogInfoColor').text(thisCatalogObject.Color);
    $('#CatalogInfoPrice').text(thisCatalogObject.Price);
};

// Add Catalog
function addnewCatalog(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCatalog input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all catalog info into one object
        var newCatalog = {
            'ProductId': $('#addCatalog fieldset input#inputProductId').val(),
            'Category': $('#addCatalog fieldset input#inputCategory').val(),
            'Brand': $('#addCatalog fieldset input#inputBrand').val(),
            'Model': $('#addCatalog fieldset input#inputModel').val(),
            'Color': $('#addCatalog fieldset input#inputColor').val(),
            'Price': $('#addCatalog fieldset input#inputPrice').val()
        }

        // Use AJAX to post the object to our addcatalog service
        $.ajax({
            type: 'POST',
            data: newCatalog,
            url: '/catalog/addcatalog',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCatalog fieldset input').val('');

                // Update the table
                populateTable();

              }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
