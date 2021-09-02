


function generateValueString(num){
  let str = 'VALUES ';
  for (let i = 0; i < num; i++){
    str += `($1, $${i + 2})`;
    if (i < num - 1) {
      str += ',';
    }
  }
  return str;
}



module.exports = generateValueString;