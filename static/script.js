$(function() {
    var drugList = [];

    // Function to add a drug to the list with a remove button
    function addDrugToList(drug) {
        drugList.push(drug);
        var listItem = $("<li><button class='remove-btn'>X</button> " + drug + "</li>");
        $("#drug-list").append(listItem);
        $("#drugs").val("");

        // Event listener for the remove button within this list item
        listItem.find(".remove-btn").on("click", function() {
            var drugToRemove = $(this).parent().text().trim(); // Get the drug text
            var index = drugList.indexOf(drugToRemove);
            if (index > -1) {
                drugList.splice(index, 1); // Remove the drug from the array
            }
            $(this).parent().remove(); // Remove the list item

        // Identify the specific drug to remove from the drugList array
        var drugToRemove = $(this).parent().text().trim().substring(1).trim();  // Remove the "X" button text and any extra spaces
        var indexToRemove = drugList.indexOf(drugToRemove);

        // Remove the specific drug from the drugList array
        if (indexToRemove > -1) {
            drugList.splice(indexToRemove, 1);
        }

        // Remove the visual list item
        $(this).parent().remove();

        // Clear the results only
        $("#results").empty();

        });
    }

    // Function to clear the drug list
    function clearList() {
        drugList = []; // Clear the drug list array
        $("#drug-list").empty(); // Remove all list items from the DOM
    }

    var drugsAutocomplete = $("#drugs").autocomplete({
        source: function(request, response) {
            $.getJSON("/autocomplete", {
                term: request.term
            }, response);
        },
        select: function(event, ui) {
            addDrugToList(ui.item.value);
            return false;
        }
    });

    $("#drugs").keydown(function(event) {
        // The keyCode for the Enter key is 13.
        if (event.keyCode === 13) {
            if (!drugsAutocomplete.autocomplete("instance").menu.active) {
                event.preventDefault();  // Prevent form submission.

                // Trigger a search.
                drugsAutocomplete.autocomplete("search", $("#drugs").val());

                // Get the first item in the suggestion list.
                var firstItem = drugsAutocomplete.autocomplete("instance").menu.element[0].children[0].textContent;

                addDrugToList(firstItem);
            }

            // Close the dropdown in any case
            $("#drugs").autocomplete("close");
        }
    });

    $("#clear").click(function() {
        drugList = [];
        $("#drug-list").empty();
        // Clear the results div using .empty()
        $("#results").empty();
    });

    $("#analyze").click(function(event) {
        event.preventDefault(); // Prevent form submission.

        $.ajax({
            url: "/",
            method: "POST",
            data: JSON.stringify(drugList),
            contentType: "application/json",
            success: function(data) {
                var resultsDiv = $("#results");
                resultsDiv.empty();
                $.each(data.results, function(i, result) {
                    resultsDiv.append("<h3>" + drugList[i] + "</h3>");
                    if (result) {
                        resultsDiv.append($("<p>").html(result));
                    } else {
                        resultsDiv.append($("<p>Drug not found</p>"));
                    }
                });
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
});

// Initialize drug list and index
let drugList = JSON.parse(localStorage.getItem("drugList")) || [];

// Function to display the drug list
function displayDrugList() {
    $("#drug-list").empty();
    drugList.forEach((drug, index) => {
        $("#drug-list").append(`<li>${drug}<button onclick="removeDrug(${index})">X</button></li>`);
    });
}

// Function to add a new drug
function addDrug(drug) {
    drugList.push(drug);
    localStorage.setItem("drugList", JSON.stringify(drugList));
    displayDrugList();
}

// Function to remove a drug
function removeDrug(index) {
    drugList.splice(index, 1);
    localStorage.setItem("drugList", JSON.stringify(drugList));
    displayDrugList();
}

// Initialize the drug list on page load
$(document).ready(function() {
    displayDrugList();
});

// Event listener for adding drugs (this would be your existing method for adding drugs)
$(document).on("click", "#add", function() {
    let drug = $("#drug").val();  // Replace this with your actual method for getting the new drug
    addDrug(drug);
});
// Event listener for the remove buttons
$(document).on("click", ".remove-btn", function(event) {
    let listItem = $(event.target).closest('li');
    let drug = listItem.text().trim().slice(0, -1);  // Remove the 'X' at the end
    let index = drugList.indexOf(drug);
    if (index > -1) {
        drugList.splice(index, 1);
    }
    listItem.remove();
});