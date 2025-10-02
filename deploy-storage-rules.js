const { exec } = require('child_process');

console.log('Desplegando reglas de Firebase Storage...');

exec('firebase deploy --only storage', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
    return;
  }
  console.log('Stdout:', stdout);
  console.log('✅ Reglas de Storage desplegadas correctamente');
});
