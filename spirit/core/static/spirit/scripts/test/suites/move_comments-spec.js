(function() {
  describe("move_comments plugin tests", function() {
    var isHidden, plugin_move_comments, show_move_comments;
    show_move_comments = null;
    plugin_move_comments = null;
    isHidden = stModules.utils.isHidden;
    beforeEach(function() {
      document.body.innerHTML = "<a class=\"js-show-move-comments\" href=\"#\" >Select comments to move</a>\n<div class=\"js-move-comments-form\" style=\"display:none;\">\n  <div class=\"move-container\">\n    <label>Topic id:</label>\n    <input id=\"id_move_comments_topic\" type=\"text\" value=\"10\" />\n    <a class=\"js-move-comments-button\" href=\"#move_url\">Move</a>\n  </div>\n</div>\n<div class=\"js-comment\" data-pk=\"1\">\n  <ul class=\"js-move-comment-checkbox-list\"></ul>\n</div>\n<div class=\"js-comment\" data-pk=\"2\">\n  <ul class=\"js-move-comment-checkbox-list\"></ul>\n</div>";
      show_move_comments = document.querySelectorAll('.js-show-move-comments');
      return plugin_move_comments = stModules.moveComments(show_move_comments, {
        csrfToken: "foobar",
        target: "/foo/"
      });
    });
    afterEach(function() {
      return Array.from(document.querySelectorAll('.js-move-comment-form')).forEach(function(elm) {
        return elm.parentNode.removeChild(elm);
      });
    });
    it("shows the move form on click", function() {
      expect(isHidden(document.querySelectorAll(".js-move-comments-form"))).toEqual(true);
      expect(document.querySelectorAll(".js-move-comment-checkbox").length).toEqual(0);
      show_move_comments[0].click();
      expect(isHidden(document.querySelectorAll(".js-move-comments-form"))).toEqual(false);
      return expect(document.querySelectorAll(".js-move-comment-checkbox").length).toEqual(2);
    });
    it("prevents the default click behaviour on show move comments", function() {
      var evt, preventDefault, stopPropagation;
      evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      stopPropagation = spyOn(evt, 'stopPropagation');
      preventDefault = spyOn(evt, 'preventDefault');
      show_move_comments[0].dispatchEvent(evt);
      expect(stopPropagation).toHaveBeenCalled();
      return expect(preventDefault).toHaveBeenCalled();
    });
    it("prevents the default click behaviour on submit", function() {
      var evt, preventDefault, stopPropagation, submit;
      evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      stopPropagation = spyOn(evt, 'stopPropagation');
      preventDefault = spyOn(evt, 'preventDefault');
      submit = spyOn(window.HTMLFormElement.prototype, 'submit');
      submit.and.callFake(function() {});
      document.querySelector(".js-move-comments-button").dispatchEvent(evt);
      expect(submit.calls.count()).toEqual(1);
      expect(stopPropagation).toHaveBeenCalled();
      return expect(preventDefault).toHaveBeenCalled();
    });
    return it("submits the form", function() {
      var form, submit;
      submit = spyOn(window.HTMLFormElement.prototype, 'submit');
      submit.and.callFake(function() {});
      document.querySelector(".js-show-move-comments").click();
      document.querySelector(".js-move-comments-button").click();
      form = document.querySelector(".js-move-comment-form");
      expect(submit.calls.count()).toEqual(1);
      expect(form.getAttribute('action')).toEqual("/foo/");
      expect(isHidden([form])).toEqual(true);
      expect(form.querySelector("input[name=csrfmiddlewaretoken]").value).toEqual("foobar");
      expect(form.querySelector("input[name=topic]").value).toEqual("10");
      return expect(form.querySelectorAll("input[name=comments]").length).toEqual(2);
    });
  });

}).call(this);

//# sourceMappingURL=move_comments-spec.js.map
