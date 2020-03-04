/* Text Processor JavaScript Library
 * Authored by Aidan S */

window.onerror = function(e){
   if(e.toString != '') {
      document.getElementById('output').value += e.toString();
   }
};

function execute(script) {
   if(script == 'encrypt') {
      document.getElementById('output').value = '';
      document.getElementById('output').value = encrypt(document.getElementById('input').value);
   }
   else if(script == 'decrypt') {
      document.getElementById('output').value = '';
      document.getElementById('output').value = decrypt(document.getElementById('input').value);
   }
   else if(script == 'lowercase') {
      document.getElementById('output').value = document.getElementById('input').value.toLowerCase();
   }
   else if(script == 'uppercase') {
      document.getElementById('output').value = document.getElementById('input').value.toUpperCase();
   }
   else if(script == 'swap') {
      temp = document.getElementById('input').value;
      document.getElementById('input').value = document.getElementById('output').value;
      document.getElementById('output').value = temp;
   }
   else if(script == 'copyinput') {
      document.getElementById('input').select();
      document.execCommand('copy');
   }
   else if(script == 'copyoutput') {
      document.getElementById('output').select();
      document.execCommand('copy');
   }
   else {
      document.getElementById('output').value = '';
      console.error("InvalidArgumentError: Failed to execute '" + script + "': Function does not exist.");
   }
}

function encrypt(input) {
   sk = (Math.floor(input.toString().length)^Math.floor(input.toString().length)).toString()+'U0JJQERVQg';
   return window.btoa(crypter(input.toString(),sk));
}
function decrypt(input) {
   sk = (Math.floor(input.toString().length)^Math.floor(input.toString().length)).toString()+'U0JJQERVQg';
   return crypter(window.atob(unescape(input.toString())),sk);
}
function crypter(is,sk) {
   os = '';
   i = [];
   for (z = 1; z <= 255; z++) {
      i[String.fromCharCode(z)] = z;
   }
   for (j = z = 0; z < is.length; z++) {
      os += String.fromCharCode(i[is.substr(z, 1)] ^ i[sk.toString().substr(j, 1)]);
      j = (j < sk.toString().length - 1) ? j + 1 : 0;
   }
   return os;
}