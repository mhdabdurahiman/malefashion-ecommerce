function bindEventHandlers() {
  $("#product-list-div").on("click", ".list-unlist-btn", function () {
    console.log("List/Unlist button clicked");
    var productId = $(this).data("product-id");
    var isList = $(this).data("is-list");

    toggleProductListing(productId, isList);
  });

  $("#product-list-div").on("click", ".delete-btn", function () {
    var productId = $(this).data("product-id");
    deleteProduct(productId);
  });
}

function toggleProductListing(productId, isList) {
  console.log("productId:", productId);
  var url = isList ? "/admin/unlist-product/" : "/admin/list-product/";
  $.ajax({
    url: url + productId,
    type: "PATCH",
    success: function () {
      $("#product-list-div").load(
        "/admin/products #product-list-div",
        function () {
          bindEventHandlers(); // Rebind event handlers after content is loaded
        }
      );
    },
    error: function (error) {
      console.error("Error updating user status:", error);
    },
  });
}

function deleteProduct(productId) {
  console.log("productId:", productId);
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    
    if (result.isConfirmed) {
      $.ajax({
        url: "/admin/delete-product/" + productId,
        type: "DELETE",
        success: function () {
          $("#product-list-div").load(
            "/admin/products #product-list-div",
            function () {
              bindEventHandlers(); // Rebind event handlers after content is loaded
            }
          );
        },
        error: function (error) {
          console.error("Error updating user status:", error);
        },
      });
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    }
  });
}

// Initial binding
bindEventHandlers();
