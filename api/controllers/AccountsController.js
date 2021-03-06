/**
 * AccountsController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res){

    var response = {
      id_user: req.session.id_user,
      token: req.session.token,
      host: sails.config.pbsync.host_files,
    };

    // Get pbsync accounts
    var options = JSON.parse(JSON.stringify(sails.config.pbsync.options));
    options.path += "/accounts?token=" + req.session.token;
    apiRest.get(options, function(accountsPbsync){
      if (accountsPbsync.response.length > 0){
        accountsPbsync.response.forEach(function(account){

          // Check if account exists
          Accounts.
          count({id_user: req.session.id_user, id_account: account.id_account}).
          then(function(accounts){
            if (accounts === 0){

              // Create local account
              Accounts.
              create(account).
              exec(function(err, created){
                if (err){
                  sails.log("Error creating accounts records: " + err);
                  return false;
                }

                return true;
              });
            }
          });
        });
      }

    });

    // Get local accounts
    Accounts.
    find().
    then(function(accounts){
      response.accounts = accounts;

      res.view('widget', response);
    });
  }
};

