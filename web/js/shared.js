if (!window.lbryforms) {
  window.lbryforms = {};

  window.lbryforms.initHost = function() {
    var host;
    if (window.location.host.indexOf("localhost") === 0) {
      host = "http://localhost:8080";
      $('h1').after('<div class="alert alert-info">Sending requests to ' + host + '</div>');
    } else {
      host = "https://api.lbry.io";
    }
    window.lbryforms.host = host;
  }

  window.lbryforms.submit = function(event, form, endpoint) {
    var alert = $("#alert");

    event.preventDefault();

    alert.css("visibility", "hidden");
    form.find('button[type=submit]').text("Working...").addClass("disabled");

    const data = $.param($.map(form.serializeArray(), function(field, index) {
      // if field is empty and doesnt have data-submit-empty=1, skip it entirely.
      // for radios/checkboxes, any input having data-submit-empty=1 will cause the field to be included.
      return (field.value == "" && form.find("[name="+field.name+"]").filter(function(){return $(this).data('submit-empty')}).length == 0) ?
             null :
             field;
    }));

    window.localStorage.setItem("auth_token", form.find('[name="auth_token"]').val());

    return $.ajax({
      url: window.lbryforms.host + endpoint,
      type: "POST",
      dataType: 'json',
      data: data,
      success: function (result) {
        alert.addClass('alert-success').removeClass("alert-danger").find('.alert-content').text(JSON.stringify(result.data, null, 2));
      },
      error: function (xhr, response, text) {
        alert.addClass('alert-danger').removeClass("alert-success").find('.alert-content').text(xhr.responseJSON.error);
      },
      complete: function() {
        alert.css("visibility", "visible")
        form.find('button[type=submit]').text("Submit").removeClass("disabled");
      },
    })
  }
}

$(document).ready(function () {
  window.lbryforms.initHost();
  $("#form").find('input[name="auth_token"]').val(window.localStorage.getItem("auth_token"));
});