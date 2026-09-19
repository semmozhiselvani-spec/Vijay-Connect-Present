/* Vijay Connect auth visibility guard
   Existing Login/Sign up UI is preserved. This only hides auth-entry controls
   after a successful local session and restores them after logout. */
(function(){
  function isLoggedIn(){
    try {
      return localStorage.getItem("vc_logged_in")==="true" ||
             sessionStorage.getItem("vc_logged_in")==="true";
    } catch(e){ return false; }
  }
  function sync(){
    var logged=isLoggedIn();
    document.documentElement.dataset.vcLoggedIn=logged?"true":"false";
    document.querySelectorAll(
      '[data-auth-entry], .login-signup, .auth-entry, #loginSignup, #login-signup'
    ).forEach(function(el){
      el.hidden=logged;
    });
  }
  document.addEventListener("DOMContentLoaded",sync);
  window.addEventListener("storage",sync);
  setTimeout(sync,300);
})();
