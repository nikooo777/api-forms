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

  window.lbryforms.req = function(method, endpoint, data) {
    data = data || {}

    if (data.hasOwnProperty("auth_token")) {
      window.localStorage.setItem("auth_token", data["auth_token"]);
    }

    return $.ajax({
      url: window.lbryforms.host + endpoint,
      type: method,
      dataType: 'json',
      data: data,
    })
  }

  window.lbryforms.submit = function(event, form, endpoint, useGloablAuthToken) {
    var alert = $("#alert");

    event.preventDefault();

    alert.css("visibility", "hidden");
    form.find('button[type=submit]').text("Working...").addClass("disabled");

    let formAuthToken = "";

    let data = $.param($.map(form.serializeArray(), function(field, index) {
      if (field.name == "auth_token") {
        formAuthToken = field.value;
      }

      // if field is empty and doesnt have data-submit-empty=1, skip it entirely.
      // for radios/checkboxes, any input having data-submit-empty=1 will cause the field to be included.
      return (field.value == "" && form.find("[name="+field.name+"]").filter(function(){return $(this).data('submit-empty')}).length == 0) ?
             null :
             field;
    }));

    if (useGloablAuthToken && !formAuthToken) {
      data += (data == "" ? "" : "&") + "auth_token=" + window.localStorage.getItem("auth_token")
    }

    return window.lbryforms.req("POST", endpoint, data)
      .done(function (result) {
        alert.addClass('alert-success').removeClass("alert-danger").find('.alert-content').text(JSON.stringify(result.data, null, 2));
      })
      .fail(function (xhr) {
        alert.addClass('alert-danger').removeClass("alert-success").find('.alert-content').text(xhr.responseJSON.error);
      }).
      always(function() {
        alert.css("visibility", "visible")
        form.find('button[type=submit]').text("Submit").removeClass("disabled");
      });
  }
}

$(document).ready(function () {
  window.lbryforms.initHost();
  $("form").find('input[name="auth_token"]').val(window.localStorage.getItem("auth_token"));
});