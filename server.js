const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Separar la ruta de los parámetros enviados por el formulario
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Si entra a "/", mostrar index.html
  let requestedFile =
    url.pathname === '/' ? '/index.html' : url.pathname;

  const filePath = path.join(
    __dirname,
    'public',
    requestedFile
  );

  console.log('Ruta del archivo solicitado:', filePath);

  fs.readFile(filePath, (err, content) => {

    if (err) {

      console.error('Error al leer el archivo:', err);

      if (err.code === 'ENOENT') {

        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8'
        });

        res.end('<h1>404 - Página no encontrada</h1>');

      } else {

        res.writeHead(500, {
          'Content-Type': 'text/html; charset=utf-8'
        });

        res.end('<h1>Error del servidor</h1>');
      }

      return;
    }


    const ext = path.extname(filePath).toLowerCase();

    let contentType = 'text/html';

    switch (ext) {

      case '.js':
        contentType = 'text/javascript';
        break;

      case '.css':
        contentType = 'text/css';
        break;

      case '.json':
        contentType = 'application/json';
        break;

      case '.png':
        contentType = 'image/png';
        break;

      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
    }


    console.log('Sirviendo archivo:', filePath);

    res.writeHead(200, {
      'Content-Type': contentType
    });

    res.end(content);
  });

});


const PORT = 3000;

server.listen(PORT, () => {
  console.log(
    `Servidor en funcionamiento en http://localhost:${PORT}`
  );
});