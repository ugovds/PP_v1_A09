const checkuserInput = {

    isValidUsername : function(input) {
        // BEGIN STRIP
        console.log(input);
        console.log(input.length);
        if(!input){
            return false;
        }
        if(input.length<6){
            return false;
        }
        return true;
        // END STRIP

    },

    isValidPassword : function(input) {
        if(!input){
            return false;
        }
        if(input.length<8){
            return false;
        }
        return true;
        // END STRIP
    },

    isValidEmail : function(input) {
        if(!input){
            return false;
        }
        if(!input.includes("@")){
            return false;
        }
        // verifie que ya un domaine
        const a = input.split("@");
        if(a.length!==2 || parts[1].length ===0){
            return false;
        }
        return true;
        // END STRIP
    }

}

module.exports = {
    checkUserInput: checkuserInput
}